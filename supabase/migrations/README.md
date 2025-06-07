# Supabase マイグレーション管理

このディレクトリはSupabaseデータベースのマイグレーションファイルを管理します。

## ディレクトリ構造

```
supabase/
├── migrations/           # タイムスタンプ付きマイグレーションファイル
│   ├── 20241207_001_initial_schema.sql
│   ├── 20241207_002_enable_rls.sql
│   └── ...
├── schema.sql           # 現在の完全なスキーマ（参考用）
├── enable_rls.sql       # RLS有効化スクリプト
└── disable_rls.sql      # RLS無効化スクリプト（開発用）
```

## マイグレーションファイルの命名規則

`YYYYMMDD_XXX_description.sql`

- `YYYYMMDD`: 日付（年月日）
- `XXX`: 連番（001から開始）
- `description`: マイグレーションの簡潔な説明

## マイグレーションの実行方法

### 1. Supabase CLIを使用する方法（推奨）

```bash
# Supabase CLIのインストール
npm install -g supabase

# プロジェクトの初期化
supabase init

# マイグレーションの実行
supabase db push
```

### 2. 手動実行

Supabaseダッシュボードから直接SQLを実行：

1. [Supabaseダッシュボード](https://app.supabase.com)にログイン
2. プロジェクトを選択
3. SQL Editorに移動
4. マイグレーションファイルの内容をコピー＆ペースト
5. 実行

## 開発環境でのRLS管理

### RLSを無効化（開発時のみ）
```bash
psql $DATABASE_URL -f supabase/disable_rls.sql
```

### RLSを有効化（本番環境）
```bash
psql $DATABASE_URL -f supabase/enable_rls.sql
```

## 注意事項

- **本番環境では必ずRLSを有効にしてください**
- マイグレーションは順番に実行する必要があります
- 実行前に必ずバックアップを取得してください
- 破壊的な変更（DROP TABLEなど）は慎重に行ってください