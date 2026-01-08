# てめえの管理運営 - デプロイガイド

アプリを永続的にインターネット上で公開するための手順です。無料で使える「Vercel」へのデプロイを推奨します。

## 方法1: GitHub連携（推奨）

最も簡単で、更新も自動化される方法です。

### 1. GitHubリポジトリの作成
1. [GitHub](https://github.com/) にログインし、新しいリポジトリを作成します。
2. リポジトリ名は `temee-no-kanri-unei` などにします。
3. 作成されたリポジトリのURL（例: `https://github.com/yourname/repo.git`）を控えます。

### 2. コードのプッシュ
PCのターミナル（コマンドプロンプトやPowerShell）で以下のコマンドを実行します。

```bash
# プロジェクトフォルダへ移動
cd c:\Users\g\.gemini\antigravity\playground\holographic-meteorite

# Git初期化
git init
git add .
git commit -m "Initial commit"

# リモート登録してプッシュ（URLは自分のものに変更）
git branch -M main
git remote add origin https://github.com/yourname/repo.git
git push -u origin main
```

### 3. Vercelで公開
1. [Vercel](https://vercel.com/) にアクセスし、GitHubアカウントでログインします。
2. 「Add New...」→「Project」をクリックします。
3. 先ほどのリポジトリで「Import」をクリックします。
4. 設定はそのままで「Deploy」をクリックします。
5. 数分待つとデプロイ完了！ URLが発行されます（例: `https://temee-no-kanri-unei.vercel.app`）。

---

## 方法2: Vercel CLI（コマンドのみ）

GitHubを使わずにコマンドだけで公開する方法です。

### 1. Vercel CLIのインストール
```bash
npm install -g vercel
```

### 2. デプロイ実行
```bash
cd c:\Users\g\.gemini\antigravity\playground\holographic-meteorite
vercel login
# (ブラウザでログイン認証を行う)

vercel
# (いくつか質問されるので全てEnterでOK)
```

### 3. 本番公開
```bash
vercel --prod
```
これで本番用URLが発行されます。

---

## PWAとして使う

発行されたURLにスマホでアクセスし、ブラウザの共有メニューから「ホーム画面に追加」を選択すると、アプリとしてインストールできます。
