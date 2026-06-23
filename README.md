# stereoheart

it's a next.js app that generates quizzes and sends notifications. also tracks my journey to becoming a good programmer (c++, leetcode, systems books) so i have this time table and i dont waste time bbeing stuck on a topic or coasting on something that doesnt matter , and just a small llm chatter so it can quiz me based on the time table.

## setup

1. `npm install`
2. create a `.env.local` and add your keys (supabase, anthropic, resend)
3. `npm run dev`

## deployment

deploy to vercel. it'll pick up the `vercel.json` for cron jobs automatically. set your env variables there too.
