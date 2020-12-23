
import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.page.html',
    styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

    selectedPath = '';

    pages = [
        {
            title: 'City guide app',
            url: '/side-menu/travel',
            icon: ''
        },
        {
            title: 'Food delivery app',
            url: '/side-menu/food',
            icon: ''
        },
        {
            title: 'Shopping app',
            url: '/side-menu/shopping',
            icon: ''
        },
        {
            title: 'Real estate app',
            url: '/side-menu/realestate',
            icon: ''
        },
        {
            title: 'Radio station app',
            url: '/side-menu/radio',
            icon: ''
        }
    ];

    constructor(private router: Router) {
        this.router.events.subscribe((event: RouterEvent) => {
            if (event && event.url) {
                this.selectedPath = event.url;
            }
        });
    }

    ngOnInit() {

    }

}