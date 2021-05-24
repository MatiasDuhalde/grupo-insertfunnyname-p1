// const orm = require('..');

// describe('post model', () => {
//   beforeAll(async () => {
//     await orm.sequelize.sync({ force: true });
//   });

//   afterAll(async () => {
//     await orm.sequelize.close();
//   });
  

//   describe('dummyPost', () => {
//     const postData = {
//       imageLink: '',
//       body: 'Insert Funny Name test',
// 			userId: 1,
//     };

//     beforeAll(async () => {
//       await orm.Post.create(postData);
//     });

//     test('', async () => {
//       const { imageLink, body, userId }  = postData;
//       const post = await orm.Post.findOne{ where: { body } });
//       expect().toThrowError('Password must be at least 6 characters');
//     });
//   });
// });