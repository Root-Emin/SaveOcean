;; Bitcoin Payment System - Clarity Smart Contract
;; Bu kontrat Bitcoin adreslerine ödeme yapmayı ve takip etmeyi sağlar

;; Sabitler
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-payment-not-found (err u102))
(define-constant err-already-paid (err u103))
(define-constant err-insufficient-balance (err u104))

;; Data Variables
(define-data-var payment-counter uint u0)
(define-data-var total-payments uint u0)

;; Data Maps
;; Ödeme bilgilerini saklayan map
(define-map payments
  { payment-id: uint }
  {
    sender: principal,
    bitcoin-address: (string-ascii 64),
    amount: uint,
    status: (string-ascii 20),
    timestamp: uint,
    block-height: uint
  }
)

;; Kullanıcıların ödeme geçmişini saklayan map
(define-map user-payments
  { user: principal }
  { payment-ids: (list 100 uint), total-sent: uint }
)

;; Bitcoin adres ödemelerini saklayan map
(define-map bitcoin-address-payments
  { bitcoin-address: (string-ascii 64) }
  { total-received: uint, payment-count: uint }
)

;; Ödeme sıralaması için map (miktara göre)
(define-map payment-rankings
  { rank: uint }
  { payment-id: uint, amount: uint }
)

;; Public Functions

;; Bitcoin adresine ödeme oluşturma
(define-public (create-payment (bitcoin-address (string-ascii 64)) (amount uint))
  (let
    (
      (payment-id (+ (var-get payment-counter) u1))
      (current-block block-height)
      (current-time (unwrap-panic (get-block-info? time current-block)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    
    ;; Ödeme kaydını oluştur
    (map-set payments
      { payment-id: payment-id }
      {
        sender: tx-sender,
        bitcoin-address: bitcoin-address,
        amount: amount,
        status: "pending",
        timestamp: current-time,
        block-height: current-block
      }
    )
    
    ;; Kullanıcı ödeme geçmişini güncelle
    (update-user-payments tx-sender payment-id amount)
    
    ;; Bitcoin adres istatistiklerini güncelle
    (update-bitcoin-address-stats bitcoin-address amount)
    
    ;; Sıralama sistemini güncelle
    (update-payment-rankings payment-id amount)
    
    ;; Sayaçları güncelle
    (var-set payment-counter payment-id)
    (var-set total-payments (+ (var-get total-payments) u1))
    
    (ok payment-id)
  )
)

;; Ödemeyi onaylama (sadece kontrat sahibi)
(define-public (confirm-payment (payment-id uint))
  (let
    (
      (payment (unwrap! (map-get? payments { payment-id: payment-id }) err-payment-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status payment) "pending") err-already-paid)
    
    (map-set payments
      { payment-id: payment-id }
      (merge payment { status: "confirmed" })
    )
    
    (ok true)
  )
)

;; Ödemeyi tamamlama
(define-public (complete-payment (payment-id uint))
  (let
    (
      (payment (unwrap! (map-get? payments { payment-id: payment-id }) err-payment-not-found))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status payment) "confirmed") err-already-paid)
    
    (map-set payments
      { payment-id: payment-id }
      (merge payment { status: "completed" })
    )
    
    (ok true)
  )
)

;; Private Functions

;; Kullanıcı ödeme geçmişini güncelleme
(define-private (update-user-payments (user principal) (payment-id uint) (amount uint))
  (let
    (
      (current-data (default-to 
        { payment-ids: (list), total-sent: u0 }
        (map-get? user-payments { user: user })
      ))
      (updated-ids (unwrap-panic (as-max-len? 
        (append (get payment-ids current-data) payment-id) 
        u100)))
    )
    (map-set user-payments
      { user: user }
      {
        payment-ids: updated-ids,
        total-sent: (+ (get total-sent current-data) amount)
      }
    )
  )
)

;; Bitcoin adres istatistiklerini güncelleme
(define-private (update-bitcoin-address-stats (bitcoin-address (string-ascii 64)) (amount uint))
  (let
    (
      (current-stats (default-to 
        { total-received: u0, payment-count: u0 }
        (map-get? bitcoin-address-payments { bitcoin-address: bitcoin-address })
      ))
    )
    (map-set bitcoin-address-payments
      { bitcoin-address: bitcoin-address }
      {
        total-received: (+ (get total-received current-stats) amount),
        payment-count: (+ (get payment-count current-stats) u1)
      }
    )
  )
)

;; Ödeme sıralamasını güncelleme (çoktan aza)
(define-private (update-payment-rankings (payment-id uint) (amount uint))
  (let
    (
      (current-total (var-get total-payments))
      (rank (+ current-total u1))
    )
    (map-set payment-rankings
      { rank: rank }
      { payment-id: payment-id, amount: amount }
    )
  )
)

;; Read-only Functions

;; Ödeme bilgisini getirme
(define-read-only (get-payment (payment-id uint))
  (map-get? payments { payment-id: payment-id })
)

;; Kullanıcının ödeme geçmişini getirme
(define-read-only (get-user-payments (user principal))
  (map-get? user-payments { user: user })
)

;; Bitcoin adres istatistiklerini getirme
(define-read-only (get-bitcoin-address-stats (bitcoin-address (string-ascii 64)))
  (map-get? bitcoin-address-payments { bitcoin-address: bitcoin-address })
)

;; Toplam ödeme sayısını getirme
(define-read-only (get-total-payments)
  (var-get total-payments)
)

;; En büyük ödemeleri getirme (sıralı)
(define-read-only (get-payment-by-rank (rank uint))
  (map-get? payment-rankings { rank: rank })
)

;; Kontrat sahibini getirme
(define-read-only (get-contract-owner)
  contract-owner
)

;; Ödeme durumunu kontrol etme
(define-read-only (is-payment-completed (payment-id uint))
  (match (map-get? payments { payment-id: payment-id })
    payment (is-eq (get status payment) "completed")
    false
  )
)

;; En yüksek miktarlı ödemeleri listele
(define-read-only (get-top-payments (limit uint))
  (let
    (
      (total (var-get total-payments))
    )
    (map get-payment-by-rank (generate-range u1 (min limit total)))
  )
)

;; Yardımcı fonksiyon: sayı aralığı oluşturma
(define-private (generate-range (start uint) (end uint))
  (if (<= start end)
    (cons start (generate-range (+ start u1) end))
    (list)
  )
)

;; Minimum değer bulma
(define-private (min (a uint) (b uint))
  (if (< a b) a b)
)