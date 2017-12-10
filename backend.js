const cmd = require('node-cmd');

const startBackEnd = () => {
  console.log('#### Installing rails bundle.... #####');
  cmd.get(
    `
      cd twitterclone_be
      bundle
    `
  , (err, data, stderr) => {
    if (err) {
      console.log('Have some error when installing bundle, please check your environment');
    } else {
      console.log('#### Installed rails bundle.... ####');
      console.log('#### Creating Database.... ####');
      cmd.get(
        `
          cd twitterclone_be
          rails db:create
          rails db:migrate
        `
      , (err, data, stderr) => {
        if (err) {
          console.log('Have some error when create database, please check your environment');
        } else {
          console.log('#### Created Database.... ####');
          console.log('#### Starting server.... ####');
          cmd.get(
            `
              cd twitterclone_be
              rails s
            `
          , (err, data, stderr) => {
            if (err) {
              console.log('Have some error when start server, please check your environment');
            }
          });
        }
      });
    }
  });
}

for (var i=0; i<process.argv.length;i++) {
  switch (process.argv[i]) {
    case 'backend':
      startBackEnd();
      break;
    case 'bar':
      bar();
      break;
  }
}

module.exports.backend = startBackEnd;