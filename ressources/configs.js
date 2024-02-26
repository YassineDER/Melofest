// You can change the config to your own local mysql server, for that you need the sql import file is in parent folder.

const db = {
    database: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'melofest',
    },
  };
  
  // Export the configs object for use in other files
  module.exports = db;
  