import { Component, Input, OnInit,ViewChild} from '@angular/core';
import { Data } from '../../models/data';
import { Device } from '../../models/device';
import { DeviceService } from '../../services/device.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent {

  deviceList = new Array<Device>()
  device = new Device()
  data = new Data()

  @Input() name: string = ''
  @Input() price: number = 0
  @Input() color: string = ''
  @Input() id2: string = ''
  @Input() name2: string = ''
  @Input() price2: number = 0
  @Input() color2: string = ''
  @ViewChild('see') see: any

  constructor(private deviceService: DeviceService, private modalService: NgbModal) { } 
  
  hasProp(o: Data, name: string) {
    return o.hasOwnProperty(name)
  }

  ngOnInit() {
    this.getAll()
  }

  getAll() {
    this.deviceService.getAll().subscribe(response => {
      this.deviceList = response
      //this.clearInputs()
    }, error => {
      console.log(error)
    })
  }

  save() {
    this.device.name = this.name
    this.data.price = this.price
    this.data.color = this.color
    this.device.data = this.data
    this.deviceService.save(this.device).subscribe((response) => {
      //this.getAll(); //
      //this.clearInputs() //
      this.insertTr(response)
    }, error => {
      console.log(error)
    })
  }

  insertTr(response: Device) {
    var tbody = document.getElementsByTagName('tbody')[0]
    var row = tbody.insertRow()
    row.setAttribute('id', response.id ?? '')
    var cell = row.insertCell()
    cell.innerHTML = response.id ?? ''
    cell = row.insertCell()
    cell.innerHTML = response.name
    cell = row.insertCell()
    cell.innerHTML = response.data.price.toString()
    cell = row.insertCell()
    cell.innerHTML = response.data.color
    cell = row.insertCell()
    var button = document.createElement('button')
    button.innerHTML = "VIEW"
    button.addEventListener('click', () => { this.view(this.see, response) })
    cell.appendChild(button)
    cell = row.insertCell()
    button = document.createElement('button')
    button.innerHTML = "DELETE"
    button.addEventListener('click', () => { this.delete(response.id ?? '') })
    cell.appendChild(button)
    this.clearInputs()
  }

  clearInputs() {
    document.getElementsByTagName('input')[0].value = ''
    document.getElementsByTagName('input')[1].value = ''
    document.getElementsByTagName('input')[2].value = ''
    document.getElementsByTagName('input')[0].focus()
  }

  delete(id: string) {
    this.deviceService.delete(id).subscribe(() => {
      document.getElementById(id)?.remove()
      this.clearInputs()
      //this.getAll() //
    })
  }

  view(see: any, device: Device) {
    this.id2 = device.id ?? ''
    this.name2 = device.name
    this.price2 = device.data.price
    this.color2 = device.data.color
    this.modalService.open(see).result.then(() => {
      this.device.id = this.id2
      this.device.name = this.name2
      this.data.price = this.price2
      this.data.color = this.color2
      this.device.data = this.data
      this.deviceService.update(this.device).subscribe((response) => {
        document.getElementById(response.id)?.remove()
        this.insertTr(response)
        //this.getAll() //
      }, error => {
        console.log(error)
      })
    })
  }


}
