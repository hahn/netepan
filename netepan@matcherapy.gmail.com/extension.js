//--Netepan
// Ekstensi untuk menampilkan jadwal shalat. Metode perhitungan menggunakan
// Prayer Times Calculator buatan Hamid Zarrabi-Zadeh (PrayTimes.org).
// Perhitungan lebih detail bisa dilihat di berkas PrayTimes.js

// Mohon diingat, hasil perhitungan kemungkinan tidak tepat dengan metode
// sebenarnya. Untuk itu, demi kehati-hatian, hendaknya waktu shalat ditambah
// sekitar 1-3 menit.

// Meski begitu, jika dibandingkan dengan hasil perhitungan
// Accurate Times versi 5.3, untuk wilayah Bandung, hanya waktu subuh saja yang
// berbeda 1 menit.

//--versi 0.1
//-- hanhan <matcherapy@gmail.com>

/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/

const Lang = imports.lang;
const St = imports.gi.St;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;
const PrayTimes = Me.imports.PrayTimes;

let pesan ='Adzan';

const PrayTimeButton = new Lang.Class({
    Name: 'PrayTimeButton',
    Extends: PanelMenu.Button,

    _init: function() {
        let menuAlignment = 0.5;
        this.parent(menuAlignment);

        this._prayTimeButtonIcon = new St.Icon({
            icon_name: 'weather-clear-night-symbolic',
            icon_size: 22,
            reactive: true,
            track_hover: true,
            style_class: 'praybutton-icon'
        });

        this._prayTimeButtonLabel = new St.Label({
            text: pesan
        });

        let topBox = new St.BoxLayout();
        topBox.add_actor(this._prayTimeButtonIcon);
        topBox.add_actor(this._prayTimeButtonLabel);
        this.actor.add_actor(topBox);
        this._topBox = topBox;
        this._createMenu();
    },

    _createMenu: function () {
      let prayTimes = new PrayTimes.PrayTimes();
      let date = new Date(); // today
      let tomorrow = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      /////-----------Atur Parameter----------------------/////
      //TODO: harusnya diatur di setting
      //atur lokasi. ini bandung, ketinggian 728 meter
      let loc = {
        city  : 'Bandung',
        lat   : -6.914744,
        lng  : 107.609810,
        elev  : 718,
        tzone : 7
      };

      //standar Indonesia, subuh 20 derajat, isya 18 derajat (sumber?)
      let paramAdjust = {
        fajr  : 20,
        dhuhr : '0 min',
        asr   : 'Standard',
        maghrib: '0 min',
        isha  : 18
      };
      ///////--------------------------------------------------///////

      prayTimes.adjust( paramAdjust );
      let times = prayTimes.getTimes(date, [loc.lat, loc.lng, loc.elev], loc.tzone);
      let timesTomorrow = prayTimes.getTimes(tomorrow, [loc.lat, loc.lng, loc.elev], loc.tzone);
      let list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      let listId = ['Subuh','Terbit','Dzuhur','Ashar','Magrib','Isya\t'];


      ////-------------submenu lokasi--------------------////
      let submenu = new PopupMenu.PopupSubMenuMenuItem(loc.city);
      let subitem = new PopupMenu.PopupMenuItem("lat: \t"+ loc.lat);
      submenu.menu.addMenuItem(subitem);
      subitem = new PopupMenu.PopupMenuItem("long: \t"+ loc.lng);
      submenu.menu.addMenuItem(subitem);
      subitem = new PopupMenu.PopupMenuItem("elv: \t"+ loc.elev + " meter");
      submenu.menu.addMenuItem(subitem);
      this.menu.addMenuItem(submenu);
      //////-----------------------------------------///////

	
      for(var i in list){
	/*
        if(i == 0 || i == 3 || i == 5){
          item = new PopupMenu.PopupMenuItem(listId[i]+"\t\t"+times[list[i].toLowerCase()]+"");
          this.menu.addMenuItem(item);
        }else { */
          item = new PopupMenu.PopupMenuItem(listId[i]+"\t\t"+times[list[i].toLowerCase()]+"");
          this.menu.addMenuItem(item);
        //}
      }
	

      ////---------setting------------------////
      //TODO: koneksi ke setting ?
      item = new PopupMenu.PopupSeparatorMenuItem();
      this.menu.addMenuItem(item);
      item = new PopupMenu.PopupMenuItem("Settings");
      this.menu.addMenuItem(item);
      ///-----------------------------------////

      Main.panel.menuManager.addMenu(this.menu);
    },

    enable: function() {
        Main.panel._rightBox.insert_child_at_index(this.container, 1);
        this.container.show();
    },

    disable: function() {
        this.container.hide();
        Main.panel._rightBox.remove_child(this.container,1);
    },
});


function init() {
    return new PrayTimeButton();
}
