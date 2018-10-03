
import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ActionSheetController, ToastController, LoadingController, Loading } from 'ionic-angular';

declare var cordova: any;
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Geolocation, Geoposition } from "@ionic-native/geolocation";
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import swal from 'sweetalert2';

declare var google;

@Component({
  selector: 'page-item-localization',
  templateUrl: 'localization.html'
})
export class LocalizationPage {
  letterObj = {
    to: '',
    from: '',
    text: ''
  }

  pdfObj = null;

  public photos: any;
  public base64Image: string;

  latitude: number;
  longitude: number;

  lastImage: any;
  names: any = [];
  insert_res;
  select_res;
  names_value;
  data: any = {};
  ine1: string;
  ine2: string;
  domicilio: string;
  curp: string;
  miComponente: any;
  account: any = {};
  fotos: any = [];

  constructor(
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
    private transfer: Transfer, private filePath: FilePath,
    public navCtrl: NavController, private plt: Platform, private file: File, private fileOpener: FileOpener,
    private sqlite: SQLite, public geolocation: Geolocation, private camera: Camera, private barcodeScanner: BarcodeScanner) {

    var UID = Math.floor(Math.random() * 999999);
    this.miComponente = UID;
  }

  /**
   * sql start 
   */

  ionViewDidLoad() {
    this.getData();
  }

  ionViewWillEnter() {
    this.getData();
    this.CREATETABLEUSERT();
    this.CREATETABLEDOCS();
    this.select();
    this.selectfotos();

  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS testtable(id INTEGER, name TEXT)', this.data)
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
  CREATETABLEUSERT() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT,ap1 TEXT, ap2 TEXT, fecha TEXT ,folio TEXT)', this.data)
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  CREATETABLEDOCS() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS docs(id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, folio TEXT)', this.data)
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }



  guardar() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO user ( nombre ,ap1 , ap2 , fecha,folio ) values (?,?,?,?,?)', [   this.account.NOMBRE    , this.account.PRIMER_APELLIDO, this.account.SEGUNDO_APELLIDO , this.account.FECHA_NACIMIENTO ,this.miComponente ])
        .then(res => {
          console.log(res);
          this.insert_res = JSON.stringify(res);

        })
        .catch(e => {
          console.log(e);

        });

    }).catch(e => {
      console.log(e);
      // this.toast.show(e, '5000', 'center').subscribe(
      //   toast => {
      //     console.log(toast);
      //   }
      // );
    });


 
    // alert('"'+this.ine1+"///"+this.miComponente)
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('INSERT INTO docs (url , folio ) values (?,?)', [  this.ine1 , this.miComponente ])
        .then(res => {
          console.log(res);
          this.insert_res = JSON.stringify(res);
          alert(this.insert_res)

        })
        .catch(e => {
          console.log(e);
          alert('error')

        });

    }).catch(e => {
      console.log(e);
      // this.toast.show(e, '5000', 'center').subscribe(
      //   toast => {
      //     console.log(toast);
      //   }
      // );
    });



  }


  select() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM user,docs WHERE user.folio= docs.folio ', this.data)
        .then(res => {
          this.select_res = JSON.stringify(res);
          this.names = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.names.push(res.rows.item(i));
          }
          // this.names_value = ''+this.names;
        })
        .catch(e => {
          console.log(e);
        });


    }).catch(e => {
      console.log(e);
    });

  }

  selectfotos() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT * FROM docs', this.data)
        .then(res => {
          this.select_res = JSON.stringify(res);
          this.fotos = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.fotos.push(res.rows.item(i));
          }
          // this.names_value = ''+this.names;
        })
        .catch(e => {
          console.log(e);
        });


    }).catch(e => {
      console.log(e);
    });

  }







  removeData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DROP TABLE IF EXISTS testtable', this.data)
        .then(res => {
          console.log('Executed SQL');
          // this.toast.show('deleted', '5000', 'center').subscribe(
          //   toast => {
          //     this.navCtrl.popToRoot();
          //   }
          // );        
        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
 

  /**
   * sql en 
   */

  createPdf() {
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        this.letterObj.to,

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ',
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPdf(docDefinition);
    alert(JSON.stringify(this.pdfObj));
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });
      alert( JSON.stringify(blob))
      // Save the PDF to the data Directory of our App
      this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
        alert(fileEntry)
        // Open the PDf with the correct OS tools
        this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
      })
    });
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      alert('cordova')
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        alert( JSON.stringify(blob))
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          alert(fileEntry)
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      alert('no cordova')

      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  scan() {

    this.barcodeScanner.scan().then((barcodeData) => {

      alert(barcodeData.text);
    })
  }


  takePhoto() {

    let options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }



    // this.camera.getPicture(options).then((imagePath) => {
    //   // Special handling for Android library
    //   if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
    //     this.filePath.resolveNativePath(imagePath)
    //       .then(filePath => {
    //         let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
    //         let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
    //         this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //       });
    //   } else {
    //     var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    //     var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    //     this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    //   }
    // }, (err) => {
    //   this.presentToast('Error while selecting image.');
    // });
    //   this.camera.getPicture( options )
    //   .then(imageData => {
    // 	this.base64Image = `data:image/jpeg;base64,${imageData}`;
    // 	// alert(this.base64Image)
    //   })

    // .catch(error =>{
    //   console.error( error );
    // });
    // const options : CameraOptions = {
    //   quality: 50, // picture quality
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }
    // this.camera.getPicture(options) .then((imageData) => {
    //     this.base64Image = "data:image/jpeg;base64," + imageData;
    //     this.photos.push(this.base64Image);
    //     this.photos.reverse();
    //   }, (err) => {
    //     console.log(err);
    //   });
  }



  getlocalizacion() {

    this.geolocation.getCurrentPosition().then(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      alert(this.latitude + "/////" + this.longitude);
    }, error => {
      console.log('error', error);
    });

  }







  ine1s() {
    if( this.account.NOMBRE && this.account.PRIMER_APELLIDO  && this.account.FECHA_NACIMIENTO ){
      
    let options: CameraOptions = {
      // quality: 80,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,

      // sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imagePath) => {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + "ine1.jpg"; 
      this.file.copyFile( imagePath.substr(0,imagePath.lastIndexOf('/') + 1), imagePath.substr( imagePath.lastIndexOf('/') + 1), imagePath.substr(0, imagePath.lastIndexOf('/') + 1), newFileName).then(success => { 
        this.ine1 = imagePath.substr(0, imagePath.lastIndexOf('/') + 1) + newFileName;

      }, error => {
        this.presentToast('Error while storing file.');
      });

    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
    }
    else{
      
      swal('ERROR',' Campos Requeridos','error');
    }

    // const options : CameraOptions = {
    //   quality: 50, // picture quality
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }
    // this.camera.getPicture(options) .then((imageData) => {
    //     this.base64Image = "data:image/jpeg;base64," + imageData;
    //     this.photos.push(this.base64Image);
    //     this.photos.reverse();
    //   }, (err) => {
    //     console.log(err);
    //   });
  }



  ine2s() {

    let options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,

      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }


    this.camera.getPicture(options).then((imagePath) => {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + "ine2.jpg";
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        // this.lastImage = newFileName;
        this.ine2 = cordova.file.dataDirectory + newFileName;

      }, error => {
        this.presentToast('Error while storing file.');
      });

    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
    //   this.camera.getPicture( options )
    //   .then(imageData => {
    //   // this.ine2 = `data:image/jpeg;base64,${imageData}`;
    //   this.ine2 =imageData;

    // 	// alert(this.base64Image)
    //   })

    // .catch(error =>{
    //   console.error( error );
    // });

  }

  domicilios() {

    let options: CameraOptions = {
      // quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,

      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: true,
      correctOrientation: true
    }


    this.camera.getPicture(options).then((imagePath) => {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + "domicilio.jpg";
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        // this.lastImage = newFileName;
        this.domicilio = cordova.file.dataDirectory + newFileName;

      }, error => {
        this.presentToast('Error while storing file.');
      });


    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
    //   this.camera.getPicture( options )

    //   .then(imageData => {
    //   this.domicilio =imageData;
    //   //  `data:image/jpeg;base64,${imageData}`;
    // 	// alert(this.base64Image)
    //   })

    // .catch(error =>{
    //   console.error( error );
    // });
  }

  curps() {

    let options: CameraOptions = {
      // quality: 80,
      // destinationType: this.camera.DestinationType.FILE_URI,
      // encodingType: this.camera.EncodingType.JPEG,

      // sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imagePath) => {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + "curp.jpg";
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        // this.lastImage = newFileName;
        this.curp = cordova.file.dataDirectory + newFileName;

      }, error => {
        this.presentToast('Error while storing file.');
      });

    }, (err) => {
      this.presentToast('Error while selecting image.');
    });

  }





  // public presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Select Image Source',
  //     buttons: [
  //       {
  //         text: 'Load from Library',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //         }
  //       },
  //       {
  //         text: 'Use Camera',
  //         handler: () => {
  //           this.takePicture(this.camera.PictureSourceType.CAMERA);
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  // public takePicture(sourceType) {
  //   // Create options for the Camera Dialog
  //   var options = {
  //     quality: 100,
  //     sourceType: sourceType,
  //     saveToPhotoAlbum: false,
  //     correctOrientation: true
  //   };

  //   // Get the data of an image
  //   this.camera.getPicture(options).then((imagePath) => {  
  //       var d = new Date(),
  //       n = d.getTime(),
  //       newFileName =   n + "ssss.jpg"; 
  //       var currentName = imagePath.substr( imagePath.lastIndexOf('/') + 1);
  //       var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
  //       this.file.copyFile(correctPath, currentName, cordova.file.dataDirectory, newFileName).then(success => { 
  //         this.lastImage = newFileName;

  //       }, error => {
  //         this.presentToast('Error while storing file.');
  //       });


  //   }, (err) => {
  //     this.presentToast('Error while selecting image.');
  //   });
  // }

  // private createFileName() {
  //   var d = new Date(),
  //   n = d.getTime(),
  //   newFileName =   n + "ssss.jpg";
  //   return newFileName;
  // }

  // // Copy the image to a local folder
  // private copyFileToLocalDir(namePath, currentName, newFileName) {
  //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {


  //     this.lastImage = newFileName;
  //     // alert(namePath +"   "+ currentName+"   "+cordova.file.dataDirectory+"    "+ newFileName)
  //   }, error => {
  //     this.presentToast('Error while storing file.');
  //   });
  // }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  // public pathForImage(img) {
  //   if (img === null) {
  //     return '';
  //   } else {
  //     alert(cordova.file.dataDirectory + img)
  //     return cordova.file.dataDirectory + img;
  //   }
  // }
}