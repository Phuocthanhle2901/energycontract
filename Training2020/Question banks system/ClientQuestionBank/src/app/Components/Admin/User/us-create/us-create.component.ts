import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-us-create',
  templateUrl: './us-create.component.html',
  styleUrls: ['./us-create.component.scss']
})
export class UsCreateComponent implements OnInit {

  constructor(private http: HttpClient) { }
  fileToUpload: File = null;
  ngOnInit(): void {
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);


}

// uploadFileToActivity() {
//   this.postFile(this.fileToUpload).subscribe(data => {
//     // do something, if upload success
//     }, error => {
//       console.log(error);
//     });
// }
// postFile(fileToUpload: File): Observable<boolean> {
//   const endpoint = 'your-destination-url';
//   const formData: FormData = new FormData();
//   formData.append('fileKey', fileToUpload, fileToUpload.name);

//   console.log(formData);
//   return this.http
//     .post(endpoint, formData)
//     .map(() => { return true; })
//     .catch((e) => console.log(e));
// }
}
