# Firebase 留言板設定說明

本網站已改成 Firebase Firestore 共用留言板。所有訪客會看到同一份留言。

## 1. 啟用 Authentication 匿名登入
1. 進入 Firebase Console。
2. 選擇專案 `fox-game-home`。
3. 左側選單點「Build」→「Authentication」。
4. 點「Get started」或進入「Sign-in method」。
5. 開啟「Anonymous / 匿名」登入方式。
6. 按「Save」。

## 2. 建立 Firestore Database
1. 左側選單點「Build」→「Firestore Database」。
2. 點「Create database」。
3. 選「正式模式 / Production mode」。
4. 地區可選離你主要使用者較近的位置，例如 `asia-east1` 或系統建議位置。
5. 建立完成後進入 Rules。

## 3. 貼上安全規則
把本 ZIP 內 `firestore.rules` 的全部內容貼到：

Firestore Database → Rules

然後按「Publish / 發布」。

這份規則會做以下限制：
- 只開放 napoleon3、mqtt-publisher、iot-dashboard 三個留言區。
- 所有人可以讀取留言。
- 只有通過 Firebase 匿名登入的使用者可以新增留言。
- 每個匿名使用者在每個留言區每天最多 5 則留言。
- 名字限制 1–30 字。
- 留言限制 1–300 字。
- 禁止 `<` 與 `>` 字元，降低惡意 HTML/Script 風險。
- 禁止前端修改或刪除留言。

## 4. 上傳網站
把 ZIP 解壓縮後，將以下檔案與資料夾上傳到 GitHub repository 的最外層：

- index.html
- assets/
- pages/
- firestore.rules
- FIREBASE_SETUP.md
- README.txt

`firestore.rules` 與 `FIREBASE_SETUP.md` 是給你參考設定用，不會影響網站顯示。

## 5. 測試
1. 打開 `https://fox520-sketch.github.io/fox/`。
2. 進入「介紹與留言」。
3. 留一則測試留言。
4. 用另一台手機或無痕視窗打開同頁面，應該可以看到同一則留言。

## 重要限制
目前每日留言次數是以 Firebase 匿名登入的使用者 ID 判斷。一般訪客會被限制，但如果有人清除瀏覽器資料、換裝置或刻意攻擊，仍可能繞過。若要更嚴格，可再加 Firebase App Check、Cloud Functions 或登入制。


## 若看到「留言被安全規則拒絕」
1. 回到 Firestore Database → Rules。
2. 確認已貼上本 ZIP 內新版 `firestore.rules` 的全部內容。
3. 按「Publish / 發布」。
4. 等 10–30 秒後重新整理網站再測試。

本版修正了每日次數文件第一次不存在時，被安全規則擋下的問題。
