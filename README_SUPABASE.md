# Supabaseu30c6u30fcu30d6u30ebu306eu8a2du5b9au624bu9806

## 1. Supabaseu30d7u30edu30b8u30a7u30afu30c8u306eu4f5cu6210

1. [Supabaseu516cu5f0fu30b5u30a4u30c8](https://supabase.com/)u306bu30a2u30afu30bbu30b9u3057u3001u30a2u30abu30a6u30f3u30c8u3092u4f5cu6210u3057u3066u30edu30b0u30a4u30f3u3057u307eu3059u3002
2. u300cNew Projectu300du30dcu30bfu30f3u3092u30afu30eau30c3u30afu3057u3066u65b0u3057u3044u30d7u30edu30b8u30a7u30afu30c8u3092u4f5cu6210u3057u307eu3059u3002
3. u30d7u30edu30b8u30a7u30afu30c8u540du3001u30c7u30fcu30bfu30d9u30fcu30b9u30d1u30b9u30efu30fcu30c9u3001u30eau30fcu30b8u30e7u30f3u3092u8a2du5b9au3057u3066u30d7u30edu30b8u30a7u30afu30c8u3092u4f5cu6210u3057u307eu3059u3002

## 2. u30c6u30fcu30d6u30ebu306eu4f5cu6210u65b9u6cd5

### u65b9u6cd5A: SQLu30a8u30c7u30a3u30bfu3092u4f7fu7528u3059u308b

1. Supabaseu30c0u30c3u30b7u30e5u30dcu30fcu30c9u306eu5de6u30e1u30cbu30e5u30fcu304bu3089u300cSQLu30a8u30c7u30a3u30bfu300du3092u9078u629eu3057u307eu3059u3002
2. u300cu65b0u3057u3044u30afu30a8u30eau300du3092u30afu30eau30c3u30afu3057u3001u4ee5u4e0bu306eu30b9u30afu30eau30d7u30c8u3092u8cbcu308au4ed8u3051u3066u5b9fu884cu3057u307eu3059uff1a

```sql
-- supabase/schema.sqlu30d5u30a1u30a4u30ebu306eu5185u5bb9u3092u30b3u30d4u30fcu3057u3066u8cbcu308au4ed8u3051u307eu3059
```

### u65b9u6cd5B: u30c6u30fcu30d6u30ebu30a8u30c7u30a3u30bfu3092u4f7fu7528u3059u308b

1. Supabaseu30c0u30c3u30b7u30e5u30dcu30fcu30c9u306eu5de6u30e1u30cbu30e5u30fcu304bu3089u300cu30c6u30fcu30d6u30ebu30a8u30c7u30a3u30bfu300du3092u9078u629eu3057u307eu3059u3002
2. u300cu65b0u3057u3044u30c6u30fcu30d6u30ebu3092u4f5cu6210u300du30dcu30bfu30f3u3092u30afu30eau30c3u30afu3057u3066u3001u4ee5u4e0bu306eu30c6u30fcu30d6u30ebu3092u624bu52d5u3067u4f5cu6210u3057u307eu3059uff1a

#### postsu30c6u30fcu30d6u30eb
- id: UUID (u30d7u30e9u30a4u30deu30eau30fcu30adu30fcu3001u30c7u30d5u30a9u30ebu30c8u5024: uuid_generate_v4())
- title: Text (u5fc5u9808)
- slug: Text (u5fc5u9808u3001u30e6u30cbu30fcu30af)
- content: Text (u5fc5u9808)
- excerpt: Text
- thumbnail_url: Text
- status: Text (u30c7u30d5u30a9u30ebu30c8u5024: 'draft')
- published_at: Timestamp with time zone
- created_at: Timestamp with time zone (u30c7u30d5u30a9u30ebu30c8u5024: now())
- updated_at: Timestamp with time zone (u30c7u30d5u30a9u30ebu30c8u5024: now())

#### tagsu30c6u30fcu30d6u30eb
- id: UUID (u30d7u30e9u30a4u30deu30eau30fcu30adu30fcu3001u30c7u30d5u30a9u30ebu30c8u5024: uuid_generate_v4())
- name: Text (u5fc5u9808u3001u30e6u30cbu30fcu30af)
- created_at: Timestamp with time zone (u30c7u30d5u30a9u30ebu30c8u5024: now())
- updated_at: Timestamp with time zone (u30c7u30d5u30a9u30ebu30c8u5024: now())

#### post_tagsu30c6u30fcu30d6u30eb
- id: UUID (u30d7u30e9u30a4u30deu30eau30fcu30adu30fcu3001u30c7u30d5u30a9u30ebu30c8u5024: uuid_generate_v4())
- post_id: UUID (u5916u90e8u30adu30fcu3001posts.idu3078u306eu53c2u7167)
- tag_id: UUID (u5916u90e8u30adu30fcu3001tags.idu3078u306eu53c2u7167)
- created_at: Timestamp with time zone (u30c7u30d5u30a9u30ebu30c8u5024: now())
- u5236u7d04: post_idu3068tag_idu306eu7d44u307fu5408u308fu305bu306fu30e6u30cbu30fcu30af

## 3. u74b0u5883u5909u6570u306eu8a2du5b9a

`.env.local`u30d5u30a1u30a4u30ebu306bu4ee5u4e0bu306eu74b0u5883u5909u6570u3092u8a2du5b9au3057u307eu3059uff1a

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

u3053u308cu3089u306eu5024u306fSupabaseu30c0u30c3u30b7u30e5u30dcu30fcu30c9u306eu300cu30d7u30edu30b8u30a7u30afu30c8u8a2du5b9au300du2192u300cAPIu300du30bfu30d6u304bu3089u53d6u5f97u3067u304du307eu3059u3002

## 4. RLSuff08Row Level Securityuff09u306eu8a2du5b9a

Supabaseu30c0u30c3u30b7u30e5u30dcu30fcu30c9u306eu300cu8a8du8a3cu300du30bbu30afu30b7u30e7u30f3u304bu3089u3001u7ba1u7406u8005u30e6u30fcu30b6u30fcu3092u4f5cu6210u3057u3066u304fu3060u3055u3044u3002u3053u306eu30e6u30fcu30b6u30fcu306fu30d6u30edu30b0u306eu7ba1u7406u753bu9762u306bu30a2u30afu30bbu30b9u3059u308bu305fu3081u306bu4f7fu7528u3055u308cu307eu3059u3002

u5404u30c6u30fcu30d6u30ebu306eRLSu30ddu30eau30b7u30fcu306fu3001SQLu30b9u30afu30eau30d7u30c8u306bu542bu307eu308cu3066u3044u307eu3059u3002u624bu52d5u3067u8a2du5b9au3059u308bu5834u5408u306fu3001u5404u30c6u30fcu30d6u30ebu306eu300cu30ddu30eau30b7u30fcu300du30bfu30d6u304bu3089u8a2du5b9au3067u304du307eu3059u3002

## 5. u30c7u30fcu30bfu306eu79fbu884cuff08u5fc5u8981u306au5834u5408uff09

u65e2u5b58u306eu30d6u30edu30b0u8a18u4e8bu3092Markdownu30d5u30a1u30a4u30ebu304bu3089Supabaseu306bu79fbu884cu3059u308bu5834u5408u306fu3001u4ee5u4e0bu306eu30b9u30afu30eau30d7u30c8u3092u4f7fu7528u3067u304du307eu3059uff1a

```typescript
// u3053u306eu30b9u30afu30eau30d7u30c8u306fu30edu30fcu30abu30ebu3067u5b9fu884cu3057u3066u3001u65e2u5b58u306eu30d6u30edu30b0u8a18u4e8bu3092Supabaseu306bu79fbu884cu3059u308bu305fu3081u306eu3082u306eu3067u3059
// scripts/migrate-to-supabase.tsu306au3069u306bu4fddu5b58u3057u3066u5b9fu884cu3057u307eu3059

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

// Supabaseu30afu30e9u30a4u30a2u30f3u30c8u306eu521du671fu5316
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migratePosts() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog');
  const filenames = fs.readdirSync(postsDirectory);
  
  for (const filename of filenames) {
    if (!filename.endsWith('.mdx')) continue;
    
    const slug = filename.replace(/\.mdx$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // u8a18u4e8bu3092u4f5cu6210
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title: data.title,
        slug,
        content,
        excerpt: data.excerpt,
        thumbnail_url: data.thumbnail || null,
        status: 'published',
        published_at: data.date,
      })
      .select()
      .single();
    
    if (error) {
      console.error(`Error inserting post ${slug}:`, error);
      continue;
    }
    
    // u30bfu30b0u3092u51e6u7406
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagName of data.tags) {
        // u30bfu30b0u304cu5b58u5728u3059u308bu304bu78bau8a8du3057u3001u306au3051u308cu3070u4f5cu6210
        let { data: tag, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();
        
        if (tagError) {
          // u30bfu30b0u304cu5b58u5728u3057u306au3044u5834u5408u306fu4f5cu6210
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select()
            .single();
          
          if (createTagError) {
            console.error(`Error creating tag ${tagName}:`, createTagError);
            continue;
          }
          
          tag = newTag;
        }
        
        // u8a18u4e8bu3068u30bfu30b0u3092u95a2u9023u4ed8u3051
        const { error: relationError } = await supabase
          .from('post_tags')
          .insert({
            post_id: post.id,
            tag_id: tag.id
          });
        
        if (relationError) {
          console.error(`Error linking post ${slug} to tag ${tagName}:`, relationError);
        }
      }
    }
    
    console.log(`Migrated post: ${slug}`);
  }
  
  console.log('Migration completed!');
}

migratePosts().catch(console.error);
```

## 6. u30c7u30d7u30edu30a4u6642u306eu6ce8u610fu70b9

1. Vercelu306au3069u306bu30c7u30d7u30edu30a4u3059u308bu5834u5408u306fu3001u74b0u5883u5909u6570u3092u9069u5207u306bu8a2du5b9au3057u3066u304fu3060u3055u3044u3002
2. Supabaseu306eRLSu30ddu30eau30b7u30fcu304cu9069u5207u306bu8a2du5b9au3055u308cu3066u3044u308bu3053u3068u3092u78bau8a8du3057u3066u304fu3060u3055u3044u3002
3. u672cu756au74b0u5883u3067u306fu3001u7ba1u7406u753bu9762u3078u306eu30a2u30afu30bbu30b9u3092u9069u5207u306bu5236u9650u3057u3066u304fu3060u3055u3044u3002
