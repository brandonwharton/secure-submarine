const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// get request with user authentication done before the request checking if someone is logged in
router.get('/', rejectUnauthenticated, (req, res) => {
  // what is the value of req.user????
  console.log('req.user:', req.user);
  // only GET from the secrets table if the secrecy level of the secret is below the user's clearance level
  const queryText = `SELECT * FROM "secret" WHERE "secrecy_level" < $1;`

  pool
  // feed in the query with the created queryText along with the clearance level of the logged-in user
    .query(queryText, [req.user.clearance_level])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
