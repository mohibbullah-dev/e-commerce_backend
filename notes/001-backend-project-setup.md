# Proect setup

backend project setup done

- backend folders structure set up
- basic route setup successfully
- DB connection setup successfully
- `api.error.js` and `api.response.js` files created

## asyncHander setup

### learn?

- setup industry-level `asyncHandler`, i have lean how to asyncHadler work internally, and why it's very smart way to handle all kinds of err.

### issue i had to face

- 1 to understand internal flow of asyncHandler like `throw error` &rarr `asyncHandler` &rarr `Global Handler` &rarr `user response`
- 2 issue in operator understand _why this line use in first_bracket?_.

```javascript
if (!(error instanceof apiError))
```

_answer is_ : javascript allway execute first in bracket, then outer if here used like `!error instanceof apiError` it will completely break the logic (!error = false then others).

- 3 i had face issue in db query like **404 user not found** even though query was okay. _The issue was_ : 1 db name was't intu url. 2 collection name and model name was't same.

- i had to face the in hashpassword fn and pre method in `user.model.js`, i had use `this` in error fn was wrong.
