;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
          global.monitorFormChange = factory()
}(this, (function () { 'use strict';

  let globalElementForm = null;

  var started = false
  
  monitorFormChange.formId = "";
  monitorFormChange.messageAlert = "The form was changed. Are you sure you want to continue?";
  monitorFormChange.showAlertOnSubmit = true;
  monitorFormChange.callbackConfirmation = _getConfirmation;
  monitorFormChange.ignoreFields = [];
  monitorFormChange.submitForm = submitMonitorForm;
  monitorFormChange.isInit = isInit
  monitorFormChange.start = start
  monitorFormChange.destroy = destroy

  function monitorFormChange(config) {
    initConfig(config);
    initMonitorFormChange();
  }
  
  function initConfig(config){
    monitorFormChange.formId = config.hasOwnProperty("formId") ? config["formId"] : monitorFormChange.formId;
    monitorFormChange.messageAlert = config.hasOwnProperty("messageAlert") ? config["messageAlert"] : monitorFormChange.messageAlert;
    monitorFormChange.showAlertOnSubmit = config.hasOwnProperty("showAlertOnSubmit") ? config["showAlertOnSubmit"] : monitorFormChange.showAlertOnSubmit;

    if (config.hasOwnProperty("callbackConfirmation") && (typeof config["callbackConfirmation"] === 'function'))
      monitorFormChange.callbackConfirmation = config["callbackConfirmation"]

    if(config.hasOwnProperty("ignoreFields") && Array.isArray(config["ignoreFields"])) 
      monitorFormChange.ignoreFields = config["ignoreFields"]
  }

  function initMonitorFormChange(){
    globalElementForm = document.getElementById(monitorFormChange.formId)
    monitorFormChange.started = true;
    
    buildSha();
    addOnChange();
    setShowMessageOnSubmit();
  }

  function start(){
    monitorFormChange.started = true;
  }

  function destroy(){
    monitorFormChange.started = false;
  }

  function isInit(){
    return monitorFormChange.started
  }
  
  function addOnChange(){
    let elements = globalElementForm.elements;
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("change", () => buildSha());
    }
  }
  
  async function buildSha(){

    if(!monitorFormChange.isInit())
      return

    let form = globalElementForm;
    let elements = form.elements
    
    let listValuesInpus = getListInputDataForm(elements);
    let textData = listValuesInpus.join('').trim().replace(/\s/g, '');

    const sha = await digestMessage(textData);
    let origin_data_sha = form.getAttribute('origin-data-sha');
  
    if (origin_data_sha == null)
        form.setAttribute('origin-data-sha', sha);

    form.setAttribute('new-data-sha', sha);
  }

  function getListInputDataForm(elements){
    let listValuesInpus = [];

    for (let i = 0; i < elements.length; i++) {
  
      var element = elements[i];

      if(ignoreField(element)){
        continue
      }
      listValuesInpus.push(getValueField(element));
    }
    return listValuesInpus;

  }

  function getValueField(element){

    var tyleElement = element.type;
    var nodeNameElement = element.nodeName;

    if (nodeNameElement === "INPUT" && 
        (tyleElement === "text" || tyleElement === "search" || tyleElement === "hidden" || tyleElement === "number")) {
      return element.value
    }else if(nodeNameElement === "INPUT" && (tyleElement === "radio" || tyleElement === "checkbox")){
      return element.checked
    }else if (nodeNameElement === "SELECT"){
      return element[element.selectedIndex].value
    }else if (nodeNameElement === "TEXTAREA"){
      return element.value
    }
  }

  function ignoreField(element){

    let ignoreField = false;
    let idElement = element.getAttribute('id');

    if(element.getAttribute("monitor-ignore-field") == 'true' || monitorFormChange.ignoreFields.includes(idElement)){
      ignoreField = true
    }
    return ignoreField;
  }
  
  function setShowMessageOnSubmit(){
    let showAlertOnSubmit = monitorFormChange.showAlertOnSubmit;
    if (!showAlertOnSubmit){
      return
    }

  }
  
  function shaChanged(){
    if (!monitorFormChange.isInit())
      return

    let shaOrigin = globalElementForm.getAttribute('origin-data-sha');
    let shaNew = globalElementForm.getAttribute('new-data-sha');
  
    if (shaOrigin != shaNew)
      return true
  
    removeInputHiddenChangeForm();
    return false
  }
  
  function buildInputHidden(){
    if (!monitorFormChange.isInit())
      return

    removeInputHiddenChangeForm();
    let elementInputHiddenChangeForm = `<input id='_monitorformchange' type='hidden' name='_monitorformchange[form_change]' monitor-ignore-field='true' value='true' />`;
    globalElementForm.insertAdjacentHTML('afterbegin', elementInputHiddenChangeForm);
  }
  
  function removeInputHiddenChangeForm(){
    var element = document.getElementById("_monitorformchange")
    if (element)
      element.remove();
  }
  
  function showAlertMessage(){
    let callback = monitorFormChange.callbackConfirmation;
    callback();
  }

  function _getConfirmation(){
      buildInputHidden();
      let _confirm = confirm(monitorFormChange.messageAlert);
      if(_confirm)
        submit();
      else
        removeInputHiddenChangeForm()

  }
  
  function submitMonitorForm(){
      if(shaChanged()){
        showAlertMessage();
      }else{
        submit();
      }
  }

  function submit(){
    if(!monitorFormChange.isInit())
      return

    globalElementForm.submit();
  }

  monitorFormChange.__VERSION__ = '0.0.1-beta';

  // Code from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Converting_a_digest_to_a_hex_string
  async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
  }

  return monitorFormChange;

})));