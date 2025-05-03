import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/naver-blog-count', async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json({ error: 'Missing keyword' });

  try {
    const response = await axios.get(
      `https://search.naver.com/search.naver?where=post&query=${encodeURIComponent(keyword)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.naver.com'
        }
      }
    );

    const $ = cheerio.load(response.data);
    const rawText = $('.title_num').text();
    const match = rawText.match(/약\s*([\d,]+)\s*건/);
    const count = match ? parseInt(match[1].replace(/,/g, '')) : null;

    res.json({ keyword, count: count ?? 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
