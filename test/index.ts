import path from 'path'
import numeral from 'numeral'
import PackageManager from '../src'

;( async () => {
  try {
    const
    options = {
      cpr: {
        source: 'http://cpr.cubic.studio:60777',
        apiversion: 1,
        token: '3UXZyRGdidWM0NTckVzbjRHdhNGZodnZzR3MxQGdpZ2bzM2ZkRzdmdWbj9Wd0cnZnVTY5V3Myd2bqF2ZnRXZ44mYzEzdxA3YqV3NrdWMqJ3Y0VWZzhmcx5GNptWao9Wc4UHcvNHNyNGcuN3b4QmalVWMzFTd3ZGO0FTMlVXNmB3cqdzZ4QHdqtGN1cGZxIHO6J2Yvp3cmBXZ1MzZ6RDdwpna092ckR3Yt1WcvdGdmhXaiFncnJmY4lWb0MmczJWc40WYjRGNwNWb1F2Y6VHcnRTN0g2c1kWZ01GN0MXY3c2bihWekVzYnFTd0dGOxYWcqV3bvRWdzA3Y1Ujc6h2djNTNzs2cxoWZiVXNxcGNyBneihmb6VjalRWN0EzcoJHOzVzMypHamNGe1B3ZyRnY4I3azMmc0Q3Zxo2NvpXYmVWdzMza3hGdnNna0kXdhhGcmFTYndWdmdmekVjb4MjZxhXbjRzZplWZvVDdndXdzM2Z1Rnb4QTe4RWN0M2ckB3ZkVHcxd2MvBHdkhWZ1NnZwNHd0cGO1ZGeyt2b0cWM0NGc182azdnalVnY0d2dvlGci5WcjRWawB3MiRTc1JmY4NHd3cme6dzYhR2MuhTM3U2atN2Y3FmZnNjYjRzZopGexRWN0MXapB3dtZzZ3NTanlWN0dmehdTc002MydneqF3a1VDazlWajtWdvVGO0VGOuRXNrNXa3A3d1EmcxcjY$3oJLnUSxtPKDY7mowTEuj1tbZjoB3XS7Xd1u'
      },
      cwd: path.resolve( process.cwd(), '../Dev/projects/Packages' ),
      debug: true,
      watcher: ( error: any, length: number, message: any ) => {
        error ?
          console.error( error )
          : console.log(`[${length !== null ? numeral( length ).format('0.0b') : '-'}] -- ${message}`)
      }
    },
    pm = new PackageManager( options )

    // console.log( await pm.install('application:multipple.sample-app', '-f -d') )

    // console.log( await pm.publish() )

    // console.log( await pm.update('application:multipple.sample-app', '-f') )

    // console.log( await pm.remove('application:multipple.sample-app') )
  }
  catch( error ) { console.log( error ) }
} )()