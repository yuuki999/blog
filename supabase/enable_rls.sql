-- u672cu756au74b0u5883u7528uff1au3059u3079u3066u306eu30c6u30fcu30d6u30ebu306eRLSuff08Row Level Securityuff09u3092u6709u52b9u306bu3059u308bu30b9u30afu30eau30d7u30c8

-- postsu30c6u30fcu30d6u30ebu306eRLSu3092u6709u52b9u5316
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- tagsu30c6u30fcu30d6u30ebu306eRLSu3092u6709u52b9u5316
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- post_tagsu30c6u30fcu30d6u30ebu306eRLSu3092u6709u52b9u5316
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- u78bau8a8du30e1u30c3u30bbu30fcu30b8
DO $$
BEGIN
  RAISE NOTICE 'u3059u3079u3066u306eu30c6u30fcu30d6u30ebu306eRLSu304cu6709u52b9u5316u3055u308cu307eu3057u305fu3002';
END $$;
