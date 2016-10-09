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
const Util = imports.misc.util;
const Clutter = imports.gi.Clutter;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Mainloop = imports.mainloop;
const PrayTimes = Me.imports.PrayTimes;

const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

let pesan ='Adzan';
let kota = 'awal';
let dLat = '-6';
let dLng = 107.609810;
let iElev = 718;

const PrayTimeButton = new Lang.Class({
    Name: 'PrayTimeButton',
    Extends: PanelMenu.Button,

    _init: function() {
        let menuAlignment = 0.5;
        this.parent(menuAlignment);
        
        this._settings = Convenience.getSettings();
        
        kota = this._settings.get_string('kota');
        dLat = this._settings.get_string('lat');
        dLng = this._settings.get_double('lng');
        iElv = this._settings.get_int('elevasi');

        this._prayTimeButtonIcon = new St.Icon({
            icon_name: 'weather-clear-night-symbolic',
            icon_size: 22,
            reactive: true,
            track_hover: true,
            style_class: 'praybutton-icon'
        });

        this._prayTimeButtonLabel = new St.Label({
            text: pesan + ' di ' + kota
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
      //atur lokasi. ini bandung, ketinggian 718 meter
      let loc = {
        city  : kota,
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
      subitem = new PopupMenu.PopupMenuItem("lng: \t"+ dLng);
      submenu.menu.addMenuItem(subitem);
      subitem = new PopupMenu.PopupMenuItem("elv: \t"+ iElev + " meter");
      submenu.menu.addMenuItem(subitem);
      this.menu.addMenuItem(submenu);
      //////-----------------------------------------///////

	
      for(var i in list){

          item = new PopupMenu.PopupMenuItem(listId[i]+"\t\t"+times[list[i].toLowerCase()]+"");
          this.menu.addMenuItem(item);

      }
	

      ////---------setting------------------////
      //TODO: koneksi ke setting ?
      
		this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

		let item = new PopupMenu.PopupBaseMenuItem();
		item.actor.add(new St.Label({ text: _("Settings") }), { expand: true, x_fill: false });
		item.connect('activate', Lang.bind(this, this._showPreferences));
		this.menu.addMenuItem(item);
      
		Main.panel.menuManager.addMenu(this.menu);
    },
    
    _showPreferences : function() {
		imports.misc.util.spawn(["gnome-shell-extension-prefs", ExtensionUtils.getCurrentExtension().metadata['uuid']]);
		return 0;
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
