import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef } from 'tmt-tang-ui';

@Component({
    selector: 'app-edit-data-modal',
    templateUrl: './edit-data-modal.component.html',
    host: {
        class: "flex w-full"
    }
})
export class EditDataModalComponent implements OnInit {
    @Input() data!:{name:string,color:string};

    public editForm: FormGroup = new FormGroup({}) ;
    colorList:string[] = [];

    constructor(private modal: TDSModalRef,private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      this.loadData();
        this.editForm = this.formBuilder.group({
            name: new FormControl(this.data.name, [Validators.required]),
        });
    }

    public hasError = (controlName: string, errorName: string) => {     
        return this.editForm.controls[controlName].hasError(errorName);
    }

    loadData(){
      this.colorList = [
        '#B5076B',
        '#A70000',
        '#F33240',
        '#FF8900',
        '#FFC400',
        '#28A745',
        '#00875A',
        '#0C9AB2',
        '#2684FF',
        '#034A93',
        '#5243AA',
        '#42526E',
        '#6B7280',
        '#858F9B',
        '#929DAA',
        '#A1ACB8',
        '#CDD3DB',
        '#D2D8E0',
        '#DDE2E9',
      ];
    }

    onChangeColor(value:string){
      this.data.color = value;
    }

    addNewColor(){
      
    }

    onSubmit() {
        if (!this.editForm.invalid) {
            this.modal.destroy(this.editForm.value);
        }
    }

    cancel() {
        this.modal.destroy(null);
    }

    save() {
        this.onSubmit();
    }
}