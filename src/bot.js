const config = require('./config/config.json');
const Snoowrap = require('snoowrap')
try {
  var factorial = (n) => Array.from({
    length: n
  }, (v, k) => k + 1).reduce((a, b) => a * b, 1)
  var double_factorial = (n) => Array.from({
    length: n
  }, (v, k) => k + 1).reduce((a, b) => a * b, 2)
  // TODO host on heroku
  const r = new Snoowrap({userAgent: 'factorialbot (v1, kjl3080)', clientId: config.clientId, clientSecret: config.clientSecret, username: config.username, password: config.password});

  console.info("Started unexpectedFactorialBot...");

  let subreddits = config.subreddits || ['all']

  subreddits.forEach(async(subreddit) => {
    r.getSubreddit(subreddit)
      .getNewComments()
      .then(async(Listing) => {
        Listing.forEach(async c => {
          let comment = await c.body
          let isFac = /(\d+\!)/;
          let isDoubleFac = /(\d+\!\!)/;
          let matched = isFac.match(comment)
          let doubleMatched = isDoubleFac.match(comment)
          if (doubleMatched !== null) {
            return c.reply(`Are you sure you meant \`${matched[0]}\`? Because that would be equal to \`${double_factorial(parseInt(matched[0].substring(0, matched[0].length - 1)))}\`.
            \nAlso, this is a double factorial, so it's less.\n^this ^bot ^ was ^ made ^by ^u/kjl3080. `);
          }
          if (matched !== null) {
            return c.reply(`Are you sure you meant \`${matched[0]}\`? Because that would be equal to \`${factorial(parseInt(matched[0].substring(0, matched[0].length - 1)))}\`.
            \n^this ^bot ^ was ^ made ^by ^u/kjl3080.`)
          }
        })
      })
  })

} catch (err) {
  console.error(err)
}
