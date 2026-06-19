var globalConfigs = (function () {
  var contextPath = "digit-studio";
  var stateTenantId = "pg";
  var appTitle = 'Digit Studio';
  var gmaps_api_key = "AIzaSyAASfCFja6YxwDzEAzhHFc8B-17TNTCV0g";
  var configModuleName = "commonUiConfig";
  var centralInstanceEnabled = false;
  var localeRegion = "IN";
  var localeDefault = "en";
  var mdmsContext = "egov-mdms-service";
  var footerBWLogoURL =
      "https://unified-dev.digit.org/egov-dev-assets/digit-footer-bw.png";
  var footerLogoURL =
      "https://unified-dev.digit.org/egov-dev-assets/digit-footer.png";
  var digitHomeURL = "https://www.digit.org/";
  var svgHeaderSecondaryLogoURL = "https://egov-qa-assets.s3.ap-south-1.amazonaws.com/studio/Studio.svg"
  var assetS3Bucket = "egov-dev-assets";
  var invalidEmployeeRoles = ["CBO_ADMIN", "ORG_ADMIN", "ORG_STAFF", "SYSTEM"];
  var mdmsFeatures = {
    bulkDownload: true,
    bulkUpload: true,
    JSONEdit: true
  };
  var mobileNumberFeatures = {
    mobilePrefix: '+91',
    mobileNumberPattern: '^[6-9]\\d{9}$',
    mobileNumberLength: 10,
  };
  var individualServiceContextPath = "/health-individual";
  var useIndividualModel = true;
  window.document.title = appTitle;

  var getConfig = function (key) {
    if (key === "STATE_LEVEL_TENANT_ID") return stateTenantId;
    else if (key === "GMAPS_API_KEY") return gmaps_api_key;
    else if (key === "ENABLE_SINGLEINSTANCE") return centralInstanceEnabled;
    else if (key === "DIGIT_FOOTER_BW") return footerBWLogoURL;
    else if (key === "DIGIT_FOOTER") return footerLogoURL;
    else if (key === "DIGIT_HOME_URL") return digitHomeURL;
    else if (key === "S3BUCKET") return assetS3Bucket;
    else if (key === "ENABLE_JSON_EDIT") return mdmsFeatures?.JSONEdit;
    else if (key === "ENABLE_MDMS_BULK_UPLOAD") return mdmsFeatures?.bulkUpload;
    else if (key === "ENABLE_MDMS_BULK_DOWNLOAD") return mdmsFeatures?.bulkDownload;
    else if (key === "CONTEXT_PATH") return contextPath;
    else if (key === "UICONFIG_MODULENAME") return configModuleName;
    else if (key === "LOCALE_REGION") return localeRegion;
    else if (key === "LOCALE_DEFAULT") return localeDefault;
    else if (key === "INVALIDROLES") return invalidEmployeeRoles;
    else if (key === "MDMS_CONTEXT_PATH") return mdmsContext;
    else if (key === "MDMS_V2_CONTEXT_PATH") return mdmsContext;
    else if (key === "MDMS_V1_CONTEXT_PATH") return mdmsContext;
    else if (key === "CORE_MOBILE_CONFIGS") return mobileNumberFeatures;
    else if (key === "INDIVIDUAL_SERVICE_CONTEXT_PATH") return individualServiceContextPath;
    else if (key === "USE_INDIVIDUAL_MODEL") return useIndividualModel;
    else if (key === "SVG_HEADER_SECONDARY_LOGO_URL") return svgHeaderSecondaryLogoURL;
  };
  return {
    getConfig,
  };
})();