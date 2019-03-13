import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { UserData } from '../models/UserData';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = true;
  user: UserData;
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user: UserData) => {
      this.isLoading = false;
      this.user = user;
    });
  }
}
