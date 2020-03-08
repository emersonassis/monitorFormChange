MonitorFormChange has the objective of to monitore changes in form and to infor about it.

__VERSION__ = 0.0.1-beta

## To Use

1 - Add MonitorFormChange in your project.

2 - Call monitorFormChange();

## Configs

formId: ID from form;

messageAlert: Message of alert.
  > By default:
    `The form was changed. Are you sure you want to continue?`

showAlertOnSubmit: If `true`, when the form is submited, show confirm message with string in config `messageAlert`.
  > By Default: `true`

callbackConfirmation: You can add a callback function to show the message confirmation.
  > By default: `confirm();`

ignoreFields: All fields on the form are monitoring, but if you want to ignore one or more fields, you must include the attribute id, of field, in the list;
  > By defaul: `[]`

submitForm: When the form is submit, the monitorFormChange verify if any field value was change, and show message for user. Note: The message just is showed if the config `showAlertOnSubmit` is `true`;

destroy: You can call this method, if you want that the monitorFormChange doesn't monitore the form.

start: If you called `destroy` but wish that monitorFormChange comeback, is may call this method.


isInit: Return `true` if monitorFormChange is started, if `false`, obviously, return false.

## Info:
  #### The monitorFormChange

+ use the SHA-256 for create one string with the values from filds.
Note: I have use exactaly the code from: [Converting a digest to a hex string
](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#Converting_a_digest_to_a_hex_string)

* add two atributes in form, when the page is ready:
1: `origin-data-sha`: with the sha from initial datas.
2: `new-data-sha`: with the same origin-data-sha value.

* add one new field, of type hidden, with the attribute name _monitorformchange[form_change], and value `true`. This field is send in submit form, so that the backend will know that the form was change.


### Exemple

```
const config = {
  formId: "form",
  messageAlert: "Form was change. Continue?",
  ignoreFields: ["idFormForIgnore1", "idFormForIgnore2", ..., "idFormForIgnoreN"]

}
monitorFormChange(config);
```

### License

This project is a sample api in Golang and open source software [licensed as MIT](https://github.com/emersonassis/monitorFormChange/blob/master/LICENSE).

