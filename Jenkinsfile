pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        nodejs(cacheLocationStrategy: workspace(), nodeJSInstallationName: 'Nodejs16') {
        sh '''ls
pwd
rm -rf build/
rm -rf blackjackbuild.tar.gz
npm install --force
npm run build
tar cvf blackjackbuild.tar.gz build
ls'''
      }
    }
  }
    stage('Upload Build') {
          steps {
            sshPublisher(publishers: [sshPublisherDesc(configName: 'scrooge-casino', transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '''rm -rf /home/ubuntu/blackjack-client/build
tar -xf /home/ubuntu/blackjackbuild.tar.gz -C /home/ubuntu/blackjack-client
rm -rf /home/ubuntu/blackjackbuild.tar.gz''', execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/', remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'blackjackbuild.tar.gz')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true)])
         }
        }

  }
}
