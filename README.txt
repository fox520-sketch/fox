狐狸小站
========

這是一個簡約清爽海洋風的靜態網站收藏頁。

檔案結構：
- index.html：首頁，包含 7 個網站卡片與原網站直連按鈕
- pages/：每個網站的獨立介紹與留言頁
- assets/styles.css：共用樣式
- assets/app.js：留言功能，使用 localStorage 儲存在使用者瀏覽器本機

使用方式：
1. 解壓縮 ZIP
2. 打開 index.html
3. 點擊「直接前往網站」或「介紹與留言」


新增功能：
- assets/qr-fox-station.png：連到狐狸小站首頁的 QR Code
- 首頁與各獨立頁面都已加入 QR Code 區塊

目前 QR Code 預設連結：
- https://fox520-sketch.github.io/fox/

如果你之後更改 GitHub repository 名稱，請同步更新 HTML 內的網址與重新產生 QR Code。

GitHub Pages 修正版：
- 這版已針對 repository 網址 /fox/ 修正。
- CSS、JS、QR 圖片路徑改為 /fox/assets/...，比較不容易在 GitHub Pages 子路徑下失效。
- 上傳時請務必把 index.html、assets/、pages/ 三個項目放在 repository 最外層。


本次新增：
- 首頁每個網站卡片加入「複製網址」按鈕
- 每個獨立介紹頁加入「複製網址」按鈕
- QR Code 區塊加入「複製首頁網址」按鈕


本版新增：
- Napoleon3 已新增為第一個首頁卡片
- 新增 pages/napoleon3.html 獨立介紹與留言頁
- Napoleon3 卡片與頁面都支援「複製網址」
- 網址：https://fox520-sketch.github.io/napoleon3/
