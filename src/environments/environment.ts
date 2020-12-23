// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    coreUrl: 'http://quychenoibo.pvn.vn',
    url : 'http://quychenoibo.pvn.vn/api/NhomTL/getNhomTL?ParentID=',// get category nhom tai lieu
    urldocument :'http://quychenoibo.pvn.vn/api/TaiLieu/getTaiLieuInfo?TailieuID=',
    url_search: 'http://quychenoibo.pvn.vn/api/TaiLieu/getTaiLieu?IdNhom=0&Page=1&RowPage=10&P_Search=',
    urldocumentmother: 'http://quychenoibo.pvn.vn/api/TaiLieu/getTaiLieuInfo?TailieuID=4257',// quan tri cong ty me
    urllist :'http://quychenoibo.pvn.vn/api/TaiLieu/getTaiLieu?IdNhom=',
    authUrlPVN : 'http://quychenoibo.pvn.vn/Auth/Login',
    apiAudit : 'http://222.255.252.41/api/HseAudits/',
    upload: 'http://222.255.252.41/content/uploads/',
    coreFileUpload: 'http://222.255.252.41/api/CoreFileUploads/',
    docUpload: 'http://222.255.252.41/api/DocumentsUpload/'

};
