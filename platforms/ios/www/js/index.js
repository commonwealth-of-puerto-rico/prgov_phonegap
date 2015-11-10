  function onBodyLoad() {
      document.addEventListener("deviceready", onDeviceReady, false);
  }

  function onDeviceReady() {

      myApp = new Framework7({
          pushState: true
      });

      mainView = myApp.addView('.view-main', {
          dynamicNavbar: true
      });

      MyAppName = "PR.GOV";
      MyAppVersion = "1.0.0";

      nativeControls = window.plugins.nativeControls;
      options = {
          "onSelect": onTabBarItem
      };
      nativeControls.createTabBar();
      nativeControls.createTabBarItem("tabdocs", "Solicitudes en Línea", "www/img/docs.png", options);
      nativeControls.createTabBarItem("tabindex", "Escanear QR Code", "www/img/qrcode64.png", options);
      nativeControls.createTabBarItem("tabinfo", "Acerca del App", "www/img/info66.png", options);

      nativeControls.showTabBarItems("tabdocs", "tabindex", "tabinfo");
      nativeControls.selectTabBarItem("tabindex");


     welcomescreen_slides = [{
          id: 'slide0',
          picture: 'storyboard1',
          text: ''
      }, {
          id: 'slide1',
          picture: 'storyboard2',
          text: ''
      }, {
          id: 'slide2',
          picture: 'storyboard3',
          text: ''
      }, {
          id: 'slide3',
          picture: 'storyboard4',
          text: '<br><br><div align="center"><button onclick="startPRGOV();" class="button button-fill color-fbcolor startme"><b>COMENZAR</b></button></div>'
      }];
      options = {
          'bgcolor': '#70c8d5',
          'fontcolor': '#fff'
      };
      

      welcome = simpleStorage.get("welcome");
      var res = "undefined".localeCompare(welcome);

      if(res === 0){  

        welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
        nativeControls.hideTabBar();
        

      }





      setTimeout(function() {
          navigator.splashscreen.hide();
         
        if(res === 1){ 
          nativeControls.showTabBar({
          position: "bottom"
          });
        }

      }, 3000);

  }
  touchMove = function(event) {
      event.preventDefault();
  };

  function onTabBarItem(id) {

      if (id == "tabdocs") {
          myApp.closePanel();
          myApp.mainView.loadPage('forms.html', false);
          finaltab = id;
      }
      if (id == "tabindex") {
          myApp.closePanel();
          myApp.mainView.loadPage('index.html', false);
          finaltab = id;
      }
      if (id == "tabinfo") {
          myApp.openPanel("right");
          finaltab = id;
      }

  }

  function startPRGOV() {
      nativeControls.showTabBar({
          position: "bottom"
      });
      welcomescreen.close();
      simpleStorage.set("welcome", "1");
      return false;
  }

  function showPanel() {
      myApp.openPanel("right");
      finaltab = "tabinfo";
      nativeControls.selectTabBarItem("tabinfo");

  }

  function scanme() {

      firstalert = simpleStorage.get("firstalert");
      var res = "undefined".localeCompare(firstalert);

      if(res === 0){  

        firstalert = "1";
        simpleStorage.set("firstalert", "1");

      }else{

        firstalert = "2";
        simpleStorage.set("firstalert", "2");
 
      }

      if(firstalert === "1") navigator.notification.alert("Para comenzar, vamos a solicitarle acceso a la cámara de su dispositivo para poder activar el escaner de PRGOV. Es importante que autorice el acceso en la próxima pantalla que le presentaremos, de lo contrario tendrá que reactivar el acceso manualmente en las preferencias del app en su dispositivo permitiendo acceso a la cámara.", 
        function (myresponse) { 

           scanproceed();

        }, "IMPORTANTE", "OK");
      else scanproceed();
      
  }

function scanproceed(){
  cordova.plugins.barcodeScanner.scan(
          function(result) {

              if (ValidUrl(result.text) && ValidGovURL(result.text)) {
                  
                  if(validGovSecureURL(result.text)) {
                    loadMyURL(result.text);  
                  }
                  else {
                    navigator.notification.alert("Hemos detectado un QR code de PR.gov pero el mismo cadece de seguridad (HTTPS). Para su seguridad no visitaremos el mismo.", {}, MyAppName, "OK");  
                  }

              }else{
                  navigator.notification.alert("No es un QR code autorizado de PR.GOV", {}, MyAppName, "OK");
              }

          },
          function(error) {
              navigator.notification.alert("No es un QR code válido", {}, MyAppName, "OK");
          }
      );
}
  function validGovSecureURL(str) {

    var parser = document.createElement('a');
    parser.href = str;

    if(parser.protocol === "https:") {
      return true
    }
    // not a valid https server, we could not
    // confirm the user will be able to validate the autheticity of the site
    return false;
  }

  function ValidGovURL(str) {

      var parser = document.createElement('a');
      parser.href = str;

      //alert("The one. The only. The onlyfrank.");      
      var temp = parser.hostname.split('.');
      
      if(temp.length >= 2){

        str1= temp[temp.length - 2];
        str2= temp[temp.length - 1]; 

        var domain = ""+ str1 +"."+ str2 +"";


        if (domain === "pr.gov" || domain === "gobierno.pr") {
                return true;
            } else {
                return false;
        }

      }

      return false;

  }

  function ValidUrl(str) {
      var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
      if (!pattern.test(str)) {
          return false;
      } else {
          return true;
      }
  }

  function showHelp() {
      myApp.closePanel();
      nativeControls.hideTabBar();
      // welcomescreen.open();
      welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
      return false;
  }

  function showAbout() {
      myApp.closePanel();
      mainView.router.loadPage('PRGOV-about.html');
      return false;
  }

  function socialsharing() {
      myApp.closePanel();
      window.plugins.socialsharing.available(function(isAvailable) {
          if (isAvailable) {
              window.plugins.socialsharing.share('Valida y solicita los nuevos Certificados de Antecendetes Penales con el App de PRGOV\n', '', 'https://servicios.pr.gov/images/applogo.png', 'https://servicios.pr.gov/app');
          }
      });
  }

  function loadMyURL(url) {
      window.open(url, '_blank', 'location=no,EnableViewPortScale=yes,closebuttoncaption=Regresar al App');
  }

  function requestsupport() {


    var finalver = '<strong>Device Platform:</strong> ' + device.platform + '<br />' + 
                   '<strong>App Version:</strong> '     + MyAppVersion     + '<br />' + 
                   '<strong>Device Version:</strong> '  + device.version  + '<br />';



      window.plugin.email.open({
          to: ['webmaster@pr.gov'],
          subject: 'PRGOV App - Apoyo Técnico',
          body: finalver,
          isHtml: true
      });
  }