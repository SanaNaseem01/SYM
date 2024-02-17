import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, take } from "rxjs";
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  title = 'micRecorder';
  //Lets declare Record OBJ
  public record: any;
  //URL of Blob
  public url: any;
  public error: any;
  public serverData: JSON | undefined;
  public employeeData: JSON | undefined;
  public mock: any | undefined;
  public studentDetails: any | undefined;
  public username: any | undefined;
  public studentID: any;
  public start_recording: boolean = false;
  public hide_default_recording_icon: boolean = true;
  public obs$ = interval(1000);
  public time_interval: number = 0;
  public limited$ = this.obs$.pipe(take(11));
  public disable_re_record: boolean = true;
  public display_content_card: boolean = false;
  public name_in_phonetics: string | undefined;
  public phoneticName: string | undefined;
  public soundsCorrectFlag: boolean = false;
  public displayGreatCapturedFlag: boolean = false;
  public tempMsg: boolean = false;
  public soundsWrongFlag: boolean = false;
  public edited_phonetics: string = '';


  // second phase of the project
  public listOfPronouns = [
    { value: '01', viewValue: 'She / Her' },
    { value: '02', viewValue: 'He / Him' },
    { value: '03', viewValue: 'They / Them' },
    { value: '04', viewValue: 'Prefer Not to Say' },
  ];
  public student_ID: string = '';
  public student_Name: string = '';
  public student_pronoun: string = '';
  public confirmed_Phonetics: string = ''
  public listOfPhonetics: any;
  public display_edit_search_bar: boolean = false;
  public show_functional_buttons: boolean = false;
  public feedbackFlag: boolean = false;
  public newNameFlag: boolean = false;
  public first_name: string = ''
  public last_name: string = ''
  public votes: number = 0


  constructor(private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,

  ) { }

  ngOnInit(): void {
    // this.justForTesting()
  }


 

  // this method handles the user action from the user interface
  public handleUserAction = (type: string, event: any) => {
    switch (type) {
      case 'search': {
        if (this.student_ID == '' || this.student_ID == null || this.student_ID == undefined) {
          this.displayMessage('Please enter the Student ID', 'ERROR')
        }
        else {
          if (/^\d+$/.test(this.student_ID)) {
            if (this.student_ID.length == 9) {
              //   if(/^[A-Za-z]*$/.test(this.student_Name)){
              //     this.display_content_card = true;
              //   }
              // else {
              //   this.displayMessage('Display some msg', 'ERROR')
              // }
              this.display_content_card = true;
            }
            else {
              this.displayMessage('Student ID should be of 9 digits', 'ERROR')
            }
          }
          else {
            this.displayMessage('Student ID should be in number only', 'ERROR')
          }
        }
        // let returnObj = {
        //   studentId: '500226573',
        //   preferredName: 'Sana',
        //   studentPronouns: 'She / Her',
        //   phonetics: ["sa-na", "sa-nah", "saa-nah", "s-naaa", "sa-nahh"]
        // }

        // ---------------------------------------------
        let pronoun = ''
        this.listOfPronouns.forEach((ele: any)=>{
          if(ele?.value === this.student_pronoun){
            pronoun = ele?.viewValue
          }
        })
          let reqObj = {
            "first_name": this.first_name,
            "last_name":this.last_name,
            "student_id" : parseInt(this.student_ID),
            "pronoun": pronoun,
            "preferred_name": this.student_ID
        }
         this.getPhonetics(reqObj)
        //-----------------------------------------------------------------
        // this.listOfPhonetics = returnObj.phonetics;
        if (this.confirmed_Phonetics == '' || this.confirmed_Phonetics == undefined || this.confirmed_Phonetics == null) {
          this.show_functional_buttons = false;

        }

        // this.listOfPhonetics = temp

        // console.log(this.studentDetails)
        // this.display_content_card = false;
        // if (this.studentDetails != undefined) {
        //   this.studentID = (this.studentDetails?.split(':'))[0]
        //   this.username = (this.studentDetails?.split(':'))[1] //return an array, taking the second element
        //   console.log("student id", this.studentID, "username", this.username)
        //   if(/^[^:]*:[^:]*$/gm.test(this.studentDetails)){
        //     if (this.studentID != "") {
        //       if (this.username != "") {
        //         if (/^\d+$/.test(this.studentID?.toString())) {
        //           if (/^[A-Za-z]*$/.test(this.username)) {
        //             this.display_content_card = true;
        //             this.soundsCorrectFlag = false;
        //             let studentDetail = {
        //               studentId: this.studentID,
        //               studentName: this.username
        //             }
        //             this.getPhonetics(studentDetail)
        //             // this.displayGreatCapturedFlag = false;
        //             // this.tempMsg = false;
        //           }
        //           else {
        //             this.displayMessage('The student name should be in letters only.', 'ERROR')
        //           }
        //         }
        //         else {
        //           this.displayMessage('The student ID should be in number only.', 'ERROR')
        //         }
        //       }
        //       else {
        //         this.displayMessage('Please enter the username', 'ERROR')
        //       }
        //     }
        //     else {
        //       this.displayMessage('Please enter the student ID', 'ERROR')
        //     }
        //   }
        //    else {
        //     this.displayMessage('Incorrect format', 'ERROR')
        //    }
        // }
        // else {
        //   console.log("last=====")
        //   this.displayMessage('Please enter the student ID and user name.', 'ERROR')
        // }
        break;
      }
      case 'phonetics-correct': {
        let confirmed_phonetics: any
        if (this.edited_phonetics == '') {
          confirmed_phonetics = this.confirmed_Phonetics
        }
        else {
          confirmed_phonetics = this.edited_phonetics
        }
        let reqObj = {
          studentId: this.student_ID,
          preferredName: this.student_Name,
          studentPronouns: this.student_pronoun,
          finalPhoneticsEditedByUser: confirmed_phonetics,
          userFeedback: "Yes"
        }
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'phonetics-wrong': {
        let confirmed_phonetics: any
        if (this.edited_phonetics == '') {
          confirmed_phonetics = this.confirmed_Phonetics
        }
        else {
          confirmed_phonetics = this.edited_phonetics
        }
        let reqObj = {
          studentId: this.student_ID,
          preferredName: this.student_Name,
          studentPronouns: this.student_pronoun,
          finalPhoneticsEditedByUser: confirmed_phonetics,
          userFeedback: "No"
        }
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'edit': {
        this.display_edit_search_bar = true;
        this.feedbackFlag = false;
        this.edited_phonetics = this.confirmed_Phonetics;
        break;
      }
      case 'phoneticsChanged': {
        this.edited_phonetics = event.value;
        this.show_functional_buttons = true;
        break;
      }
      case 'save': {
        let reqObj = {}
        let preferredNameArray = []
        let name_Selection = []
        if (this.edited_phonetics == '') {
          reqObj = {
            studentId: parseInt(this.student_ID),
            name: preferredNameArray.push(this.student_Name),
            name_selection: name_Selection.push(this.confirmed_Phonetics),
            votes: this.votes,
            show:"True"
          }
        }
        else {
          reqObj = {
            studentId: parseInt(this.student_ID),
            name: preferredNameArray.push(this.student_Name),
            name_selection: name_Selection.push(this.edited_phonetics),
            votes: this.votes,
            show:"True"
          }
        }

      //   {
      //     "student_id": 2004930408,
      //     "name": ["sanjeev", "kandel"],
      //     "name_selection":["S-AE-N-JH-IY-V","ˈkændəl"],
      //     "votes":1,
      //     "show":"True"
      // }

        
        this.savePhonetics(reqObj)
        break;
      }
      default: {
        break;
      }
    }
  }

  // global function to show toaster message
  private displayMessage = (message: string, state: string) => {
    switch (state.toLowerCase()) {
      case 'error':
        this.toastr.error(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'info':
        this.toastr.info(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'success':
        this.toastr.success(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      default:
        break;
    }

  }

  // initiats the recording to record the user's voice
  // private initiateRecording() {
  //   let mediaConstraints = {
  //     video: false,
  //     audio: true
  //   };
  //   navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  // };

  // public sanitize(url: string) {
  //   return this.domSanitizer.bypassSecurityTrustUrl(url);
  // };

  // private successCallback(stream: any) {
  //   //Start Actual Recording
  //   var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
  //   this.record = new StereoAudioRecorder(stream, {
  //     mimeType: 'audio/wav',
  //   });
  //   this.record.record();
  //   this.displayMessage('Please start speaking.', 'INFO')
  // };


  // private stopRecording() {
  //   this.record.stop(this.processRecording.bind(this));
  // };
  // /**
  // * processRecording Do what ever you want with blob
  // * @param  {any} blob Blog
  // */
  // private processRecording(blob: any) {
  //   this.url = URL.createObjectURL(blob);
  //   console.log("blob", blob);
  //   console.log("url", this.url);
  // };

  // private errorCallback(error: any) {
  //   this.error = 'Can not play audio in your browser';
  // };

  // calling the service from the backend to get the required phonetics.
  private getPhonetics = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/createpost', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
      //   {
      //     "data": {
      //         "student_id": 2004930417,
      //         "first_name": "abhinav",
      //         "full_name": "abhinav nair",
      //         "first_name_p": [
      //             "AEBAHNHHAEF"
      //         ],
      //         "split_first_name": [
      //             "ab-hi-nav"
      //         ]
      //     },
      //     "results": []
      // }
        this.votes = requestedData?.data?.votes
        let p1 = requestedData?.data?.split_first_name
        let p2 = requestedData?.data?.results
        this.student_Name = requestedData?.data?.preferredName
        this.student_pronoun = requestedData?.data?.studentPronouns
        this.first_name = requestedData?.data?.first_name
        this.last_name = requestedData?.data?.last_name
        this.student_ID = requestedData?.data?.student_id
        this.listOfPhonetics = p1.concat(p2)
        this.displayMessage('Successful API response.', 'SUCCESS')
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })
  }

  private giveUserFeedback = (reqObj: any) => {
    // this.ngxService.start();
    // this.httpClient.post('http://127.0.0.1:5002/userFeedback', reqObj).subscribe(data => {
    //   let requestedData: any = data
    //   if (requestedData?.status === "success") {
    //     this.ngxService.stop();
        this.tempMsg = true;
    //     this.displayMessage('Feedback Captured', 'SUCCESS')
    //   }
    //   else {
    //     this.displayMessage('Could not process the request', 'ERROR')
    //     this.ngxService.stop();
    //   }
    // })

  }

  private savePhonetics = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/selection', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.displayMessage('Feedback Captured', 'SUCCESS')
        this.feedbackFlag = true;
      }
      else {
        this.displayMessage('Could not process the request', 'ERROR')
        this.ngxService.stop();
      }
    })
  }

  // private justForTesting = () => {
  //   let reqObj = {
  //     "first_name": "abhinav",
  //     "last_name":"nair",
  //     "student_id" : 2004930417,
  //     "pronoun": "He/Him",
  //     "lang_name":"en",
  //     "course": "AIGS",
  //     "intake": "Fall",
  //     "year": 2023
  // }
  //   this.httpClient.post('http://127.0.0.1:8081/createpost', reqObj).subscribe(data => {
  //     console.log(data)
  //   })
  // }
}
