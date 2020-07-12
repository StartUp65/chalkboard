module.exports = {
  name: 'chalkboard',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/chalkboard',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
