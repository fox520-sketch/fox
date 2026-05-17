狐狸網路遊戲之家
========

這是一個簡約清爽海洋風的靜態網站收藏頁，已針對 GitHub Pages 路徑 /fox/ 設定完成。

本版更新：
- 保留 3 個網站：拿破崙與秘書、MQTT 測試發佈器、IoT Dashboard Pro+
- 拿破崙與秘書放在首頁最前面
- Napoleon3 介紹已更新為撲克牌遊戲「拿破崙與秘書」內容
- 遊戲說明包含：54 張、5 人各 10 張、4 張底牌、A/K/Q/J 頭牌、叫牌 9–16 頭、王牌、底牌、秘書牌、牌力順位、變體規則與多人休閒對戰
- 已刪除 4 個舊網站的介紹頁與首頁卡片
- 每個保留網站都有「直接前往網站」、「複製網址」、「介紹與留言」
- QR Code 指向狐狸網路遊戲之家首頁：https://fox520-sketch.github.io/fox/

檔案結構：
- index.html：首頁
- pages/napoleon3.html：拿破崙與秘書介紹與留言頁
- pages/mqtt-publisher.html：MQTT 測試發佈器介紹與留言頁
- pages/iot-dashboard.html：IoT Dashboard Pro+ 介紹與留言頁
- assets/styles.css：共用樣式
- assets/app.js：留言與網址複製功能
- assets/qr-fox-station.png：狐狸網路遊戲之家首頁 QR Code

上傳 GitHub Pages 時，請把 index.html、assets/、pages/ 放在 repository 最外層。


Firebase 留言板：
- 留言改用 Firebase Firestore，所有訪客都能看到。
- 請先閱讀 FIREBASE_SETUP.md，並到 Firebase Console 貼上 firestore.rules。
- 每位匿名使用者每個留言區每日最多 5 則，名字 30 字內，留言 300 字內。


重要：如果留言顯示「被安全規則拒絕」，請到 Firebase Firestore Rules 貼上並發布本 ZIP 內新版 firestore.rules。
