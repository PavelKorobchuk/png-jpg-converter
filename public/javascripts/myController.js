
angular.module('myController', [])
.controller('myController', ['$scope','$http','Todos', function($scope, $http, Todos) {
    $scope.formData = {};
    $scope.loadingIsShow = false;
    $scope.convertFile = convertFile;
    $scope.convertBtnShow = false;
    $scope.selectFormatShow = false;
    $scope.formatsArray = [];
    $scope.selectFormatError = false;

    var data,
        selectedFormatToConvert,
        inputFormatToConvert;
    //upload file
  $(document).ready(function(){
        $('#uploadFile').on('change', function(){
        var fileInput = document.getElementById('uploadFile');
        var file = fileInput.files[0];        
        if(file !== undefined) {
            data = new FormData();
            data.append('file', file);            
            $scope.convertBtnShow = true;            
            $scope.selectFormatShow = true;
            updateFormatSelect(file.type);         
            $scope.$apply();
        } else {
            $scope.convertBtnShow = false;
            $scope.selectFormatShow = false;
            $scope.selectFormatError = true;
            $scope.$apply();
            // console.log('Upload files')
        }
    });
  })

    //convert uploaded file
    function convertFile() {
                $scope.convertBtnShow = false;
                $scope.loadingIsShow = true;
                
                data.append('format', selectedFormatToConvert);
                $.ajax({
                        method: 'post',
                        url: '/upload',
                        contentType: false,
                        processData: false,
                        data: data,
                        beforeSend: $scope.loadingProgress,
                }).done(function(response){
                      console.log('200');
                      console.log('res---', response);
                      window.location = 'upload/'+response
               
                             //window.location = '/'
                             $scope.convertBtnShow = false;
                             $scope.selectFormatShow = false;                    
                             $scope.loadingIsShow = false;
                             $scope.$apply();
             
                });
    };

    function updateFormatSelect(format) {
       switch(format) {
    case 'image/png':
        $scope.formatsArray = [{id:1, size:'jpg'}];
        $scope.selectFormatError = false;
        break;
    case 'image/jpeg':
        $scope.formatsArray = [{id:2, size:'png'}];
        $scope.selectFormatError = false;
        break;
    case 'application/pdf':
        $scope.formatsArray = [{id:1, size: 'jpg'}, {id:2, size:'png'}];
        $scope.selectFormatError = false;
        break;
    default:
        $scope.selectFormatError = true;
}
    }
        $scope.updateSelectOption = function (option) {
        console.log(option.size);
        selectedFormatToConvert = option.size;
    }
}])
