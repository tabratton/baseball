module.exports = {
  pluginOptions: {
    s3Deploy: {
      registry: undefined,
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
      pwa: false,
      enableCloudfront: true,
      cloudfrontId: 'EOMAUFJK3QTWB',
      cloudfrontMatchers: '/index.html,/service-worker.js,/manifest.json',
      pluginVersion: '4.0.0-rc3',
      uploadConcurrency: 5
    }
  }
}
