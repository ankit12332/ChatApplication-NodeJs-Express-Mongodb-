class UserDto {
    constructor(userInput) {
      this.name = userInput.name;
      this.email = userInput.email;
      this.password = userInput.password;
    }
  }
  
  module.exports = UserDto;
  