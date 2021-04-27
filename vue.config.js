module.exports = {
  pluginOptions: {
    s3Deploy: {
      awsProfile: 'default',
      overrideEndpoint: false,
      region: 'us-east-1',
      bucket: 'baseball.bratton.dev',
      createBucket: false,
      staticHosting: true,
      staticIndexPage: 'index.html',
      staticErrorPage: 'index.html',
      assetPath: 'dist',
      assetMatch: '**',
      deployPath: '/',
      acl: 'public-read',
      pwa: true,
      pwaFiles: 'index.html',
      enableCloudfront: true,
      cloudfrontId: 'EOMAUFJK3QTWB',
      cloudfrontMatchers: '/index.html,/service-worker.js,/manifest.json',
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 5,
      gzip: true
    }
  }
}
