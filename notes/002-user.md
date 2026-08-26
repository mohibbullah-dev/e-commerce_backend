# user

- user schecma is created
- adminLogin controler created,
- this methood has ben used for hiding password before sending respons to user.
  _like:_

```javascript
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
```

- `authMiddleware` & `roleMidleware` added
