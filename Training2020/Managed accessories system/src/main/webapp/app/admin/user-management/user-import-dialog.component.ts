import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { UserService } from 'app/core/user/user.service';
import { UserImportValidator, ErrorListBuilder } from './user-import-validate';

import * as fileSaver from 'file-saver';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
    templateUrl: './user-import-dialog.component.html',
})
export class UserImportDialogComponent {
    file: File | undefined | null;
    progress = 0;
    message = '';
    errorList : {locale: string, line: number, param1: string, param2 : null | undefined | string}[] = [];

    NOT_CONTAINS_FIRST_SPACE = "error.field.atLine.notContainsFirstSpace";
    NOT_CONTAINS_SPACES = "error.field.atLine.notContainsSpace";
    MAX_LENGTH = "error.field.atLine.max";
    MIN_LENGTH = "error.field.atLine.min";
    REQUIRED = "error.field.atLine.required";
    USER_EXISTED = "error.field.atLine.loginExist";
    NUMBER = "error.field.atLine.number";
    NOT_CONTAINS_NUMBER = "error.field.atLine.numberFalse";
    EMAIL = "error.field.atLine.email";
    ID_NOT_EXIST = "error.field.atLine.idFalse";
    NOT_CONTAINS_CHARACTERS = "error.field.atLine.characterFalse";
    INVALID_PHONE = "error.field.atLine.phone";
    EMPTY_LINE = "error.field.atLine.emptyLine";
    MISSING_FIELD = "error.field.atLine.notEnoughFields";

    constructor(protected userService: UserService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    cancel(): void {
        this.activeModal.dismiss();
    }

    saveFile(data: any, filename?: string): void{
        const blob = new Blob([data], {type: 'text/csv; charset=utf-8'});
        fileSaver.saveAs(blob, filename);
    }

    dropFile(event: NgxDropzoneChangeEvent ): void {
        this.file = event.addedFiles[0];
        this.validate(this.file);
    }

    validateType(filename: string): boolean {
        const arr = filename.split('.');
        return arr[arr.length - 1] === "csv";
    }

    validate(importedFile: File): void {
        this.errorList.length = 0;
        this.errorList = [];

        if(!this.validateType(importedFile.name)){
            this.errorList.push({"locale": "error.file.not.csv", "line": 0, "param1": "", "param2": null});
            return;
        }

        const reader : FileReader = new FileReader();
        reader.readAsText(importedFile);
        reader.onload = () => {
            const csv : any = reader.result;
            let allTextLines: string[] = [];
            allTextLines = csv.split(/\r|\n|\r/);

            const headers = allTextLines[0].split(',');
            const validator = new UserImportValidator();
            const errorBuilder = new ErrorListBuilder();
            for(let i = 1; i < allTextLines.length; i++){
                const line: string[] = allTextLines[i].split(",");
                if(!validator.isEmpty(allTextLines[i])){
                    if(line.length === 8){
                        const newUser = validator.isEmpty(line[0]);
                        const newEmpl = validator.isEmpty(line[1]);

                        errorBuilder.add(!validator.isNumber(line[0]), {
                            "locale": this.NUMBER, "line": i, "param1": "User id", "param2": null
                        })
                        .add(validator.containsSpaces(line[0]), {
                            "locale": this.NOT_CONTAINS_SPACES, "line": i, "param1": "User id", "param2": null
                        })

                        .add(!validator.isNumber(line[1]), {
                            "locale": this.NUMBER, "line": i, "param1": "Employee id", "param2": null
                        })
                        .add(validator.containsSpaces(line[1]), {
                            "locale": this.NOT_CONTAINS_SPACES, "line": i, "param1": "Employee id", "param2": null
                        })

                        .add(validator.containsSpaces(line[2]), {
                            "locale": this.NOT_CONTAINS_SPACES, "line": i, "param1": "Login", "param2": null
                        })
                        .add(validator.isEmpty(line[2]) && newUser, {
                            "locale": this.REQUIRED, "line": i, "param1": "Login", "param2": null
                        })

                        .add(validator.containsNumber(line[3]), {
                            "locale": this.NOT_CONTAINS_NUMBER, "line": i, "param1": "First name", "param2": null
                        })
                        .add(validator.firstCharacterIsASpace(line[3]), {
                            "locale": this.NOT_CONTAINS_FIRST_SPACE, "line": i, "param1": "First name", "param2": null
                        })
                        .add(validator.isEmpty(line[3]) && newUser, {
                            "locale": this.REQUIRED, "line": i, "param1": "First name", "param2": null
                        })

                        .add(validator.containsNumber(line[4]), {
                            "locale": this.NOT_CONTAINS_NUMBER, "line": i, "param1": "Last name", "param2": null
                        })
                        .add(validator.firstCharacterIsASpace(line[4]), {
                            "locale": this.NOT_CONTAINS_FIRST_SPACE, "line": i, "param1": "Last name", "param2": null
                        })
                        .add(validator.isEmpty(line[4]) && newUser, {
                            "locale": this.REQUIRED, "line": i, "param1": "Last name", "param2": null
                        })

                        .add(!validator.isEmailAddress(line[5]), {
                            "locale": this.EMAIL, "line": i, "param1": "Email", "param2": null
                        })
                        .add(validator.firstCharacterIsASpace(line[5]), {
                            "locale": this.NOT_CONTAINS_FIRST_SPACE, "line": i, "param1": "Email", "param2": null
                        })
                        .add(validator.containsNumber(line[5]), {
                            "locale": this.NOT_CONTAINS_NUMBER, "line": i, "param1": "Email", "param2": null
                        })
                        .add(validator.isEmpty(line[5]) && newUser, {
                            "locale": this.REQUIRED, "line": i, "param1": "Email", "param2": null
                        })

                        .add(!validator.isNumber(line[6]), {
                            "locale": this.NUMBER, "line": i, "param1": "Area id", "param2": null
                        })
                        .add(validator.containsSpaces(line[6]), {
                            "locale": this.NOT_CONTAINS_SPACES, "line": i, "param1": "Area id", "param2": null
                        })
                        .add(validator.isEmpty(line[6]) && newEmpl, {
                            "locale": this.REQUIRED, "line": i, "param1": "Area id", "param2": null
                        })

                        .add(!validator.isPhoneNumber(line[7]), {
                            "locale": this.INVALID_PHONE, "line": i, "param1": "Phone number", "param2": null
                        })
                        .add(validator.firstCharacterIsASpace(line[7]), {
                            "locale": this.NOT_CONTAINS_FIRST_SPACE, "line": i, "param1": "Phone number", "param2": null
                        })
                        .add(validator.isEmpty(line[7]) && newEmpl, {
                            "locale": this.REQUIRED, "line": i, "param1": "Phone number", "param2": null
                        });
                    }
                    else{
                        errorBuilder.add(true, {"locale": this.MISSING_FIELD, "line": i, "param1": line.length.toString(), "param2": null});
                    }
                }
                else if(i < allTextLines.length - 1){
                    errorBuilder.add(true, {"locale": this.EMPTY_LINE, "line": i, "param1": "", "param2": null});
                }
            }

            this.errorList = errorBuilder.build();
        }
    }

    confirmImport(): void {
        this.progress = 0;
        
        if(this.errorList.length <= 0){
            this.userService.upload(this.file!).subscribe(
                event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progress = Math.round(100 * event.loaded / event.total!);
                    } else if (event instanceof HttpResponse) {
                        this.message = event.body.message;
                    }
                    this.eventManager.broadcast('employeeListModification');
                    this.activeModal.close();
                },
                () => {
                    this.progress = 0;
                    this.message = 'Could not upload the file!';
                    this.file = undefined;
                });
            this.file = undefined;
        }
    }

    close(error: {locale: string, line: number, param1: string, param2 : null | undefined | string}): void {
        const index = this.errorList.indexOf(error, 0);
        if (index > -1) {
            this.errorList.splice(index, 1);
        }
        if(this.errorList.length === 0)
            this.errorList.length = 1;
    }

    closeSuccess(): void{
        const alert = document.getElementById("successAlert");
        alert?.remove();
    }
}