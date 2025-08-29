# ppdiary - MCP Server だけで書ける日記

ppdiary は Model Context Protocol (MCP) を使用した日記管理システムです。MCP サーバーとして動作し、Claude などのクライアントから日記の作成・管理が可能です。

## コンセプト

「MCP Server だけで書ける日記」というコンセプトのもと、シンプルな日記管理機能を提供します。SQLite をベースに、ローカルで完全に動作する軽量な日記システムです。

## 機能

- 📝 日記の作成・編集・削除
- 🔍 キーワード検索
- 📄 ページネーション対応
- 🗄️ SQLite による永続化
- 🐳 Docker 対応

## 必要要件

- Node.js 24.7.0 以上（ローカルインストールの場合）
- Docker（Docker を使用する場合）

## MCP クライアント設定

### Claude Desktop の設定例

Claude Desktop の設定ファイル（`claude_desktop_config.json`）に以下を追加します：

```json
{
  "mcpServers": {
    "ppdiary": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-v",
        "/Users/your-name/ppdiary-data:/app/data",
        "ghcr.io/ppworks/ppdiary:latest"
      ]
    }
  }
}
```

**重要**:
- `/Users/your-name/` の部分を実際のユーザー名に置き換えてください
- `ppdiary-data` ディレクトリは自動的に作成されます
- このディレクトリに SQLite データベースファイルが保存されます


## 使い方

Claude Desktop で ppdiary が設定されていれば、以下のような操作が可能です：

### 日記を書く
```
「ppdiaryに今日の日記を書きたい」
「タイトル：素晴らしい一日、内容：今日は...という日記を作成して」
```

### 日記を検索
```
「ppdiaryから"旅行"というキーワードで日記を検索して」
「最近の日記を10件表示して」
```

### 日記を読む
```
「ppdiaryで、ID: xxx の日記を表示して」
```

### 日記を編集
```
「ppdiaryで、ID: xxx の日記のタイトルを変更して」
```

### 日記を削除
```
「ppdiaryの、ID: xxx の日記を削除して」
```

## API リファレンス

ppdiary は以下の MCP ツールを提供します：

| ツール名 | 説明 | パラメータ |
|---------|------|------------|
| `get_diary_list` | 日記一覧を取得 | `query?`, `order?`, `page?`, `perPage?` |
| `get_diary` | 特定の日記を取得 | `id` |
| `create_diary` | 新しい日記を作成 | `title`, `content` |
| `update_diary` | 日記を更新 | `id`, `title`, `content` |
| `delete_diary` | 日記を削除 | `id` |

## データの保存場所

- **Docker 使用時**: マウントしたボリューム（例：`~/ppdiary-data/`）
- **ローカル実行時**: プロジェクトディレクトリ内の `data/` フォルダ

データベースファイル（`diary.db`）は SQLite 形式で保存されます。

## 開発

### 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test

# カバレッジ付きテスト
npm run test:coverage

# リント
npm run lint

# 型チェック
npm run type-check
```

### ビルド

```bash
npm run build
```

### Docker イメージのビルド

```bash
docker build -t ppdiary .
```

## トラブルシューティング

### データベースファイルが見つからない
- Docker 使用時はボリュームマウントのパスが正しいか確認してください
- 権限の問題がないか確認してください

### MCP サーバーが起動しない
- Node.js のバージョンが 24.7.0 以上であることを確認してください
- Docker の場合、コンテナが正常に起動しているか確認してください

## ライセンス

MIT

## 作者

[@ppworks](https://github.com/ppworks)

## コントリビューション

Issue や Pull Request は歓迎します！

## サポート

問題や質問がある場合は、[GitHub Issues](https://github.com/ppworks/ppdiary/issues) でお知らせください。
