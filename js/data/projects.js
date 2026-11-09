/* Project content. The first three show as full cards on the home page; the rest sit behind "More". */

export const projects = [
  {
    slug: 'loan-approval',
    ico: 'CR',
    title: 'Predicting Loan Default and Approval',
    tag: 'Machine learning',
    blurb:
      "Built a default-risk model on 546,000 real loans that ranks borrowers better than Lending Club's own grades, after cleaning 1.6 million applications.",
    sum: "Which loan applicants will actually repay, and can a model built only from application data beat the lender's own risk grades?",
    role: 'Personal project · Lending Club data, 2007–2015',
    tools: ['Python', 'pandas', 'scikit-learn', 'XGBoost', 'SHAP'],
    stats: [
      { n: '546K', l: 'finished loans with a known outcome: repaid or defaulted' },
      {
        n: '0.385 vs 0.357',
        l: "Gini of my default model vs Lending Club's own grade on later loans",
      },
      { n: '$260m vs $274m', l: 'predicted vs actual 2015 credit losses' },
      { n: '0.93 → 0.61', l: 'fake vs honest Gini after I fixed a data leak' },
    ],
    problem:
      'Lenders receive far more applications than people can review, and every wrong decision costs money. As an example, in this data, declining a good borrower lost about $1,800 of expected profit, while approving a lousy borrower led to about $5,000 of losses. For decades, lenders have used hard policy rules to automate approval and rejection, especially for clear-cut cases. This project tests whether a machine learning algorithm can decide the applicants those rules are unable to, and predict which approved borrowers will actually default.',
    approach: [
      "Cleaned and combined Lending Club's accepted and rejected application files (29.9 million rows, two 1.7 GB files) into 1.61 million comparable applications.",
      'Applied four hard policy rules first, such as a minimum credit score of 660. On their own they decided 64% of applications.',
      'Built an approval model for the applications the rules left open: compared five machine learning models, tuned the best one (XGBoost) and built a points scorecard as a simpler, explainable alternative.',
      "Built a default model on 546,000 loans whose outcome is known. It gives each applicant a probability of default (PD), the chance they will not repay. I left out Lending Club's own grade and interest rate so I could compare my model against them, and tested it on 2015 loans it never saw.",
      {
        h: 'The data leak I caught',
        p: 'My first model scored a near-perfect Gini of 0.93, which is a warning sign on credit data. I found that approved loans stored credit scores on a fixed 5-point grid while rejected ones stored exact scores, so the model was learning which file a number came from, not credit risk. After I put both files on the same precision, the honest score was 0.61.',
      },
      {
        h: 'Built the way a bank would deploy it',
        p: 'Every decline comes with its top two reasons, such as "debt-to-income ratio too high", as US lending rules require. I chose the scorecard\'s variables by how well each one separates good and bad borrowers, instead of a simple correlation cut-off. I checked that both models stay stable on newer data (PSI under 0.03, a standard drift measure where under 0.1 is stable), excluded zip codes (and states, in the default model) because they can act as a proxy for race, and wrote a model card listing each model\'s limits.',
      },
    ],
    results: [
      "My default model ranked 2015 borrowers better than Lending Club's own risk grade: a Gini of 0.385 against 0.357. Gini scores from 0 to 1 how well a model puts risky borrowers above safe ones. Combined with the grade, it raised the Gini from 0.360 to 0.407, so it spots risk the grade misses.",
      'The riskiest tenth of borrowers by my model defaulted 11 times as often as the safest tenth (32.7% vs 3.0%). Predicted losses for 2015 came to $260m after the yearly recalibration banks apply, against $274m actual.',
      "Lending Club's interest rates already covered most of the risk: declining more than about 5% of borrowers would have lost money, whichever ranking was used. At every level, though, ranking by my model did better than ranking by the grade (declining the riskiest 2%: +$2.4m vs −$0.4m).",
      'The approval model reached a Gini of 0.570 on later applications. I set its cut-off at 0.21 from the real profit and loss of 215,205 finished loans, instead of the default 0.5.',
    ],
    learnedH: 'What I learnt and areas of improvement',
    learned: [
      'A result that looks too good is a reason to investigate, not to celebrate: my near-perfect first model was learning the file format, not credit risk.',
      "Predicting a lender's decision is not the same as predicting repayment. The approval model copied Lending Club's old policy, so I rebuilt the target around whether borrowers actually repaid.",
      'To improve the project, I would estimate how rejected applicants would have performed (reject inference), since the default model only learns from approved borrowers. I would also build a separate model for 60-month loans and estimate recoveries loan by loan instead of using one average.',
    ],
    verdict:
      "Machine learning can help decide the applications that hard rules leave open, and a default model built only from application data ranked borrowers better than Lending Club's own grade. It works best alongside the rules rather than replacing them. At Lending Club's interest rates, its biggest value is in pricing loans and setting aside money for losses, not in declining more applicants.",
    image: 'images/loan-approval/pd-roc.png',
    imageAlt:
      "ROC curves on 2015 loans: the default model sits above Lending Club's sub-grade, the scorecard and logistic regression",
    gallery: [
      {
        src: 'images/loan-approval/pd-loss-by-decile.png',
        alt: 'Bar chart of expected and actual 2015 losses by risk decile, rising from about 7 million dollars to over 50 million dollars',
        cap: 'Predicted vs actual 2015 losses for each tenth of borrowers, from safest (D1) to riskiest (D10). The line shows the actual default rate.',
      },
      {
        src: 'images/loan-approval/pd-strategy.png',
        alt: "Line chart: declining the riskiest loans by my model loses less money than declining by Lending Club's grade at every level",
        cap: "What declining the riskiest 2015 loans would have done to the net result, ranked by my model vs by Lending Club's grade.",
      },
      {
        src: 'images/loan-approval/pd-shap.png',
        alt: 'SHAP summary chart: credit score, recently opened accounts, loan-to-income and debt-to-income drive the default probability',
        cap: 'What drives the default probability (SHAP). Credit score matters most, followed by recently opened accounts, loan size relative to income and debt-to-income.',
      },
    ],
  },
  {
    slug: 'electronics-sales',
    ico: 'EL',
    title: 'How Can an Electronics Seller Boost Sales?',
    tag: 'Data analysis',
    blurb:
      'Analysed 8,149 Amazon electronics products to help sellers boost sales: where revenue sits, which discounts link to higher demand and which products to pair.',
    sum: 'Where should an electronics seller focus its prices, discounts and bundles to sell more?',
    role: 'Personal project · Amazon electronics listings, August 2025',
    tools: ['Python', 'pandas', 'Market Basket analysis', 'JavaScript', 'Power BI', 'Tableau'],
    dash: 'amazon',
    stats: [
      { n: '8,149', l: 'products left after cleaning 42,675 raw rows' },
      { n: '32%', l: 'of minimum revenue comes from $100–250 products, 24% of the range' },
      { n: '+35%', l: 'demand at 20–30% off vs no discount, same category and price' },
      { n: '10.5×', l: 'how much more often keyboards and mice are sold together than by chance' },
    ],
    problem:
      'Enterprises selling electronics online compete with thousands of similar products, so each decision on price and promotion matters. This project tests where a seller should focus its prices, discounts and product bundles to boost sales.',
    approach: [
      'Used a dataset of 42,675 Amazon electronics listings collected from 21 to 30 August 2025. It has no sales figures, so I treated Amazon\'s "bought in past month" label (such as "300+") as minimum units sold, and price × that figure as minimum revenue.',
      'Fixed the data errors I found: 1,192 prices of $1,000 or more stored with commas that a simple conversion would have lost, 7,294 demand values that held other page text, and 33,858 repeated rows, leaving one row per product. I left out 668 protection plans and memberships, as almost none had a price or demand figure.',
      'Sorted products into 24 categories from their titles. A hand check of 100 random products found 83 right, 9 wrong and 8 left in "Other".',
      'Analysed prices, discounts and ratings within each category, so TVs were not compared with cables, and tested how far the results held up.',
      'Built the dashboard in JavaScript to fit this website.',
      {
        h: 'Market Basket analysis without baskets',
        p: 'Market Basket analysis finds products bought together, but this data has no orders. Instead, I treated each listing as a basket: its main product plus any add-ons its title says are included. I then calculated lift (how much more often a pair appears than by chance), and read every title behind the significant rules. Many looked like pairs but were features, such as a "case with stand", so I removed them. This shows what sellers package together, not what shoppers buy together.',
      },
    ],
    resultsH: 'Results',
    results: [
      'Revenue and volume sit in different places. Products at $100–250 are 24% of the range but bring 32% of minimum revenue, while products under $25 are 25% of the range and bring 58% of units but only 15% of revenue. Printers and ink is the largest category, at 17% of revenue.',
      'Discounts are linked to higher demand only from about 10% upwards. Compared with no discount, at the same selling price and in the same category, demand was 22% higher at 10–20% off and 35% higher at 20–30% off. Discounts of 1–10% showed no clear difference, and going past 30% showed no further gain. Also allowing for review counts lowers the 35% to 25%.',
      'Trends were steady over the 10 days: of 245 products priced on at least two days, 171 kept the same price, 44 fell and 30 rose, with no clear overall direction. Demand is highly concentrated, as the top 10% of products hold 68% of minimum units.',
      'Four pairs held up: keyboard and mouse (41 listings, lift 10.5), light and stand (12, lift 8.7), desktop and mouse (17, lift 5.4) and instant camera and film (11, lift 3.1). Listings sold as a pair did not show higher demand overall (8% lower, not statistically reliable).',
      'The data shows links, not causes, and covers only 10 days. Better products may earn both discounts and sales, and the "bought" labels are rounded minimums, so these results are ideas to test rather than proof.',
    ],
    learnedH: 'What I learnt and areas of improvement',
    learned: [
      'To question what a method can really say: the data had no orders, so I had to be clear that my Market Basket analysis measures listings rather than shoppers. Reading the titles behind each rule also removed pairs that looked strong in the numbers but were not real.',
      "To improve this project, I would use a seller's real order data, which would allow a true Market Basket analysis, and run controlled tests to measure what discounts actually cause.",
    ],
    verdict:
      'The analysis suggests a seller should look to the $100–250 range for revenue, use discounts of at least 10% rather than token ones, and offer natural pairs such as a keyboard with a mouse or a desktop with a mouse. Because this data cannot prove what causes a sale, I would trial these ideas on real orders before rolling them out.',
  },
  {
    slug: 'ask-valencia',
    ico: 'AI',
    title: 'Ask My AI: A Chatbot About Me',
    tag: 'LLMs',
    blurb:
      'A chatbot that answers questions about me from my CV, a reference letter and project reports, and says so when it does not know.',
    sum: "Can a chatbot answer a recruiter's questions about me without ever making something up?",
    role: 'Personal project',
    when: 'Nov 2026',
    tools: ['Python', 'RAG', 'sentence-transformers', 'BM25', 'DeepSeek API'],
    chat: true,
    stats: [
      { n: '48 / 48', l: 'test questions passed, including 16 it had to refuse' },
      { n: '122', l: 'short passages from my CV, a reference letter and my project reports' },
      { n: '6–18 s', l: 'time to answer on the live site once the server is awake' },
      { n: '0', l: 'phone numbers or e-mail addresses it can share: all removed before indexing' },
    ],
    problem:
      'Chatbots are good at sounding confident, which is a problem when the subject is a real person. A recruiter asking about me needs answers that are true, and a clear "I don\'t know" when my documents don\'t say. This project tests whether a chatbot can answer only from my own documents, and admit when they do not cover a question.',
    approach: [
      'Collected my CV, a recommendation letter from my MTR internship manager and the reports of my loan, gold, Amazon and Netflix projects, and removed every phone number and e-mail address before indexing.',
      'Split them into 122 short passages and built a RAG chatbot (it looks up my documents before answering, instead of relying on memory).',
      'Searched the passages both by meaning and by keyword, re-ranked the best matches with a second model, and let the LLM (DeepSeek) answer only from the top five.',
      'Told it to say it is unsure when even the best match is a poor fit, and to list the documents each answer came from.',
      'Limited each visitor to 15 questions every 10 minutes. Questions and answers were logged during testing, but the live version does not store them.',
      {
        h: 'Testing the questions it should refuse',
        p: 'I wrote 48 test questions, and I re-run them after every change to the documents or the instructions. 19 of them have no answer it is allowed to give: my GPA, my salary expectations, off-topic requests, trick prompts such as "ignore all previous instructions", and requests for my contact details. A chatbot that answers everything confidently would pass the easy questions and fail these.',
      },
    ],
    results: [
      'Passed 48 of 48 test questions: 25 it should answer, 16 it should refuse (including off-topic and trick questions), 3 asking for contact details and 4 follow-up questions.',
      'Answers in 6 to 18 seconds on the live site once the server is awake, and lists the documents each answer came from.',
    ],
    learnedH: 'What I learnt and areas of improvement',
    learned: [
      'Most of the work was teaching it to say "I\'m not sure". Testing questions it should refuse mattered as much as testing the ones it should answer.',
      'An automatic test can be wrong too: one correct refusal failed only because of its wording ("her materials don\'t list any weaknesses"), so I check failed answers by hand before changing anything.',
      '<span class="todo">To improve the project, I would … (for example, hosting it online so visitors can use it; it currently runs only on my laptop)</span>',
    ],
    verdict:
      'Yes, within limits. Answering only from my own documents, it passed every test question, including the ones it had to refuse, and never gave out contact details. It can only be as complete as the documents behind it, so anything they do not cover gets an honest "I\'m not sure".',
    image: 'images/ask-valencia/how-it-works.svg',
    imageAlt:
      "Diagram: the question is matched to passages from Valencia's documents, re-ranked, checked for relevance, then answered by the LLM using only those passages",
  },
  {
    slug: 'netflix-catalogue',
    ico: 'NF',
    title: 'Should I Keep Paying for Netflix?',
    tag: 'Data analysis',
    blurb:
      'Analysed 8,804 Netflix titles to decide whether to keep my subscription: new series now dominate, while film additions lean on older titles.',
    sum: 'What has Netflix been adding, and does it still suit how I watch?',
    role: 'Personal project · Netflix catalogue data, 2016–2021',
    tools: ['Python', 'pandas', 'Data cleaning', 'JavaScript', 'Power BI', 'Tableau'],
    dash: true,
    stats: [
      { n: '8,804', l: 'titles left after cleaning 8,809 raw rows' },
      { n: '2,014', l: 'titles added in 2019, the busiest full year' },
      { n: '76% → 40%', l: 'films added within a year of release, 2016 vs 2021' },
      { n: '67%', l: 'of TV series on Netflix have only one season' },
    ],
    problem:
      'With the cost of living rising every day, I often re-evaluate my expenses. This project helps me decide whether to keep my Netflix subscription.',
    approach: [
      'Downloaded a public dataset that lists every title on Netflix in September 2021 with the date it was added.',
      'Fixed the data errors I found: 3 duplicated titles, 4 titles that Excel had turned into dates, 3 runtimes stored as age ratings, and 2 rows added by hand in 2024 in a different format, which I left out.',
      'Analysed when titles were added, how old they were at the time, and their genres, age ratings and lengths.',
      'Built the dashboard first in Tableau, then rebuilt it in JavaScript to fit this website.',
    ],
    resultsH: 'Results',
    results: [
      'New films became rarer while new series became the norm. In 2016, 76% of the films Netflix added had come out that year or the year before; by 2021 it was 40%. TV went the other way, from 51% to 72%.',
      'Additions grew almost fivefold, from 429 titles in 2016 to 2,014 in 2019, and 2021 (to 25 September) was 10% ahead of the same period in 2020.',
      'Films make up 70% of the catalogue (6,129 of 8,804 titles), and over half of all titles (54.5%) are not adult-rated: they are rated for teens or younger.',
      'The data is a snapshot of what was on Netflix in 2021, so titles removed before then are missing. That could under-count older films added in early years, so the trend is a strong hint rather than proof.',
    ],
    learnedH: 'What I learnt and areas of improvement',
    learned: [
      'The art of being meticulous: small errors, such as a film title that Excel turned into a date, are easy to miss, and datasets can hide duplicates that a simple check will not catch. Putting data checks in place is what keeps the results accurate and valid.',
      'To improve this project, I would update the dashboard with the titles Netflix currently lists in Hong Kong.',
    ],
    verdict:
      'Netflix keeps adding new titles, and fresh releases have shifted towards series, while film additions rely more on older titles. As someone who enjoys re-watching older films, the analysis suggests I should keep my subscription, which I did!',
  },
  {
    slug: 'automation-others',
    ico: 'Py',
    title: 'Automation &amp; others',
    tag: 'Automation',
    blurb:
      'Python scripts that download audio, transcribe it and rename files in bulk, plus a prompt that gets an LLM to build short title videos.',
    sum: 'Handing repetitive work, from collecting audio to making title videos, over to code and LLMs.',
    tools: ['Python', 'yt-dlp', 'ElevenLabs API', 'openpyxl', 'Playwright', 'FFmpeg'],
    intro:
      'These are small tools I built to avoid repetitive work. The YouTube, transcript and rename scripts prepared the Indonesian scam audio data for my final-year project.',
    parts: [
      {
        h: '1. Automating YouTube downloads',
        p: [
          'Turned a spreadsheet of YouTube links into a numbered folder of MP3 files, with no manual downloading.',
        ],
        points: [
          "Read each row of an Excel sheet with openpyxl, taking the link from the cell's hyperlink or text and the file number from another column.",
          'Downloaded the best available audio with yt-dlp (a video download tool) and converted it to 192 kbps MP3 with FFmpeg.',
          'Named each file after its spreadsheet number, so every recording traces back to its row.',
          'Kept going when a download failed, and printed any row skipped for a missing link or number.',
        ],
        code: {
          file: 'downloadYoutube.py (excerpt, shortened)',
          src: `base_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'ignoreerrors': True,
}

r = 4
while ws.cell(row=r, column=4).value is not None:
    url = get_url(ws.cell(row=r, column=4))
    idx = ws.cell(row=r, column=2).value

    if url and idx is not None:
        idx = int(idx) if isinstance(idx, float) else idx   # 5.0 -> 5
        opts = {**base_opts, 'outtmpl': f'audio/audio_{idx}.%(ext)s'}
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([url])
    else:
        print(f"Row {r} skipped (url={url}, index={idx})")

    r += 1`,
        },
        fig: {
          src: 'images/automation/audio-files.jpg',
          alt: 'Finder window of a folder named audio holding numbered MP3 files, from audio_1.mp3 to audio_75.mp3',
          cap: 'Result: audio files named by their spreadsheet number.',
        },
      },
      {
        h: '2. Using LLM for video generation',
        p: [
          'Used an LLM to create a title scene of up to 5 seconds for a direction video, which shows people the way to a location. The prompt below has the LLM build the animation in JavaScript on a canvas, then render it to MP4 with Playwright (a browser automation tool) and FFmpeg.',
          'I ask for a few example styles and a storyboard before the full render, so I can choose a look and check the plan first.',
        ],
        prompt:
          'Create a intro/ title scene (maximum of 5 seconds) for direction video. Generate the video in phone portrait mode, build it in Javascript on a canvas and render it to mp4 with playwright and FFmpeg. Before you render the whole video, first generate a few examples/ styles for me to choose from and generate a storyboard on how you plan the intro/ title scene to be. This 5 second clip is mainly just for title (to show people what the video is).',
        fig: {
          src: 'images/automation/storyboard.jpg',
          alt: 'Storyboard frames in a paper collage style: cut-out letters spelling Direction To appear one by one above an instant photo of a wooden door, with some details blurred',
          cap: 'Result: storyboard frames for the title scene, with some details blurred.',
        },
      },
      {
        h: '3. Automating audio transcripts',
        p: [
          'Turned audio files into text files that show who spoke and when.',
          'ElevenLabs is very good for transcription but is often costly, so I call its API (a way for code to use the service directly), which is more cost-effective. The code can also be modified for live transcription.',
        ],
        points: [
          "Sent the audio to ElevenLabs' Scribe v2 speech-to-text model, set to Indonesian, with speaker labels and tags for audio events such as laughter.",
          'Grouped the returned words into segments, starting a new one when the speaker changes or a sentence ends.',
          'Wrote each segment on its own line with start and end times and the speaker.',
          'Skipped files already transcribed and listed any failures at the end, so a batch can be run again safely.',
          'Kept the API key out of the code by loading it from a private environment file.',
        ],
        code: {
          file: 'elevenTranscript.py (excerpt)',
          src: `def transcribe(audio, output_file):
    with open(audio, "rb") as f:
        transcription = elevenlabs.speech_to_text.convert(
            file=f,
            model_id="scribe_v2",
            tag_audio_events=True,   # laughter, applause, etc.
            language_code="id",      # Indonesian
            diarize=True,            # who is speaking
        )

    with open(output_file, "w", encoding="utf-8") as out:
        for seg in build_segments(transcription.words):
            out.write(
                f"[{format_ts(seg['start'])} - {format_ts(seg['end'])}] "
                f"{seg['speaker']}: {seg['text'].strip()}\\n"
            )`,
        },
        out: {
          file: 'Format of each output line',
          src: '[HH:MM:SS.mmm - HH:MM:SS.mmm] speaker: text',
        },
      },
      {
        h: '4. Automating file renames',
        p: [
          'Renamed transcript files in bulk to match the numbering in the dataset spreadsheet, with a safe way to undo it.',
        ],
        points: [
          'Read old and new numbers from two spreadsheet columns, for example audio_9.txt becomes audioTranscript_8.txt.',
          'Stopped before changing anything if two files would end up with the same name, or a new name would hit an existing file.',
          'Renamed in two passes through temporary names, so one rename cannot overwrite another.',
          'Added a <code>--dry-run</code> option to preview the changes, and <code>--undo</code> to restore the old names from a log file.',
        ],
        code: {
          file: 'rename_transcripts.py (excerpt)',
          src: `def apply(folder, pairs):
    """Rename in two passes so audio_9 -> 8 can't overwrite an existing audio_8."""
    temps = []
    for old, new in pairs:
        tmp = old + ".renaming"
        os.rename(os.path.join(folder, old), os.path.join(folder, tmp))
        temps.append((tmp, new))
    for tmp, new in temps:
        os.rename(os.path.join(folder, tmp), os.path.join(folder, new))`,
        },
        fig: {
          src: 'images/automation/transcripts.jpg',
          alt: 'Finder window of a folder named text clean holding numbered transcript files, from audioTranscript_1.txt to audioTranscript_72.txt',
          cap: 'Result: renamed transcripts, numbered without gaps. The audio folder in section 1 skips 8, 34 and 66.',
        },
      },
    ],
  },
  {
    slug: 'gold-risk-ranges',
    ico: 'Au',
    title: 'Forecasting Gold Volatility and Risk Ranges',
    tag: 'Market risk',
    blurb:
      'Built risk ranges for gold in Hong Kong dollars that hit their 95% target on unseen weeks. An LSTM could not predict the price.',
    sum: 'How far could the price of gold in Hong Kong dollars move in the next hour, week or month, and can that answer be trusted?',
    role: 'Personal project · Dukascopy data, May–Nov 2026',
    tools: ['Python', 'GARCH', 'statsmodels', 'PyTorch', 'LSTM', 'pandas'],
    stats: [
      { n: '95.8%', l: 'of hourly prices inside my 95% risk range over six unseen weeks' },
      {
        n: '4×',
        l: 'gap in volatility between the busiest and quietest hour, built into the model',
      },
      { n: '29,975–34,241', l: 'HKD per ounce: my 80% range for 30 November 2026' },
      { n: '0 of 3', l: 'price models, including an LSTM, that beat "the price stays the same"' },
    ],
    problem:
      'Anyone holding, hedging or pricing gold in Hong Kong dollars needs to know how far the price could move, not just where it might go. Risk limits and hedges are sized on that range, so it has to hold up on data the model has never seen. This project tests how well a volatility model can forecast that range from the previous 3 to 6 months of prices, and whether a neural network can predict the price itself.',
    approach: [
      'Downloaded six months of minute-by-minute gold prices in Hong Kong dollars (the buying, or ask, price) from Dukascopy, and checked the price scale against the Hong Kong dollar peg.',
      'Cleaned 185,071 minutes of real quotes into 3,090 hourly prices, keeping genuine jumps such as the minutes after US economic data releases.',
      'Forecast volatility with GARCH (a model of how much prices are likely to move), adjusted for the time of day and for weekend price gaps.',
      'Tested the ranges the way a risk team would use them: refitted every week over six rolling weeks, then on the first week of November, which no model saw.',
      'Tested whether an LSTM (a neural network that reads a sequence of past prices), ARIMA or a simple trend model could predict the price itself, to decide where to centre the ranges.',
      {
        h: 'Direction is a coin toss, size is not',
        p: 'Past hourly moves did not predict the direction of the next one in any statistical test. The size of moves did cluster, and it followed the clock: 8 a.m. New York time, when US economic data are released, was about four times as volatile as 4 p.m.',
      },
      {
        h: 'Checking my own results',
        p: 'Before trusting the numbers I fixed five problems: a one-hour time shift when US clocks changed on 1 November, a volatility model that ignored the time of day, weekend price gaps, a statistically insignificant drift that tilted the November range downwards, and simulated ranges that changed slightly on every run.',
      },
    ],
    results: [
      '95.8% of hourly prices fell inside my 95% range over six unseen weeks, and 82.2% inside my 80% range. A standard test found the miss rate in line with the target (p = 0.34), and the misses were spread out rather than bunched.',
      "Adjusting for the time of day made the ranges narrower without losing coverage. A plain GARCH model's 95% range was wider than needed (96.7% of hours inside), and a simple rolling average missed in clusters.",
      'An honest miss: in the first week of November gold rose 5.3% in four days. The 1-hour range held 89.3% of hours, below its 95% target, and the week-ahead range was too narrow. I report this rather than tuning it away.',
      'No model beat "the price stays the same": over 687 unseen hours the LSTM\'s error was within 0.05% of it (p = 0.77). Trained for longer, it got better on past data and worse on new data, a clear sign it was memorising noise.',
      'Set an 80% range for 30 November of 29,975 to 34,241 HKD per ounce around the 5 November price of 32,034 HKD, to be checked at month end.',
    ],
    learnedH: 'What I learnt and areas of improvement',
    learned: [
      'For a bank, the useful question is often not where a price will go but how far it could move. Answering it well took careful handling of time zones, weekends and the daily rhythm of the market.',
      'A risk model has to be judged on the weeks that go wrong, not only on its average.',
      "To improve the project, I would add a daily volatility model, so week-ahead ranges react faster to a rally like November's, and check the 30 November range once the month ends.",
    ],
    verdict:
      "The direction of gold could not be predicted from past prices, not even by an LSTM, but how far it could move could. A GARCH model adjusted for the time of day gave risk ranges that held their target on unseen weeks, though they were too narrow during November's sharp rally. For gold in Hong Kong dollars, a well-tested range is more useful than a price forecast.",
    image: 'images/gold-risk-ranges/november-ranges.png',
    imageAlt:
      'Gold price in Hong Kong dollars through October and early November 2026, with risk ranges widening towards 30 November',
    gallery: [
      {
        src: 'images/gold-risk-ranges/predicted-vs-actual.png',
        alt: 'Bar chart of hourly price moves against the predicted 95% range over seven weeks; only a few bars, marked red, cross the line',
        cap: "Each bar is one hour's move; the line is my predicted 95% range. Red bars fell outside: 29 of 687 hours in the six rolling test weeks, and 10 of 93 in the November test week.",
      },
      {
        src: 'images/gold-risk-ranges/time-of-day.png',
        alt: 'Bar chart of gold volatility by hour of day in New York time, peaking at 8 a.m. and lowest at 4 p.m.',
        cap: 'Volatility by hour of day (New York time). The model scales every forecast by this pattern; 17:00 is the daily trading break.',
      },
      {
        src: 'images/gold-risk-ranges/learning-curve.png',
        alt: 'Learning curve: training error keeps falling while error on unseen data rises above the no-change benchmark',
        cap: "Why the ranges are centred on today's price: the longer the LSTM trains, the better it fits past data and the worse it does on new data.",
      },
    ],
  },
];
