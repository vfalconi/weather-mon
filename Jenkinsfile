pipeline {
	agent {
		label 'nodejs'
	}
	stages {
		stage('Dependencies') {
			steps {
				sh 'git clone https://git.hexd.network/vince/weather-mon weather-mon'
				sh 'npm --prefix weather-mon install'
			}
		}
		stage('Run scraper') {
			steps {
				configFileProvider([ configFile(fileId: '7d029e33-41e4-4cba-822f-b1ff22fca83c', targetLocation: 'weather-mon/config.kdl') ]) {
					sh 'npm --prefix weather-mon run-script scrape'
    		}
			}
		}
	}
	post {
		// Clean after build
		always {
			cleanWs(
				cleanWhenAborted: true,
				cleanWhenFailure: true,
				cleanWhenNotBuilt: true,
				cleanWhenSuccess: true,
				cleanWhenUnstable: true,
				deleteDirs: true,
				skipWhenFailed: false
			)
		}
	}
}
