const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gettext = imports.gettext.domain(Me.metadata['gettext-domain']);
const _ = Gettext.gettext;

const modelColumn = {
    label: 0,
    separator: 1
}

function init() {
    Convenience.initTranslations();
}

const NetepanPrefsWidget = new GObject.Class({
	
	Name: 'Netepan.Prefs.Widget',
    GTypeName: 'NetepanPrefsWidget',
    Extends: Gtk.Grid,
    
    _init: function(params){
		this.parent(params);
        this.margin = this.row_spacing = this.column_spacing = 15;
        
        this._settings = Convenience.getSettings();
        let i = 0;
        
        this.attach(new Gtk.Label({ label: _('Kota'), halign : Gtk.Align.END}), 0, i, 1, 1);
        this._entryKota = new Gtk.Entry();
        let txtKota = 'gnudnab';
        this._entryKota.connect('key-press-event', Lang.bind(this, function(text){
				txtKota = text.get_text();
				this._settings.set_string('kota', txtKota);

			}));
		
		
        this.attach(this._entryKota, 1, i++, 1, 1);
        
        this.attach(new Gtk.Label({ label: _('Latitude'), halign : Gtk.Align.END}), 0, i, 1, 1);
        this._entryLat = new Gtk.Entry();
        this._entryLat.connect('key-press-event', Lang.bind(this, function(text){
				this._settings.set_string('lat', this._entryLat.get_text());

			}));
        
        this.attach(this._entryLat, 1, i++, 1, 1);
        
        this.attach(new Gtk.Label({ label: _('Longitude'), halign : Gtk.Align.END}), 0, i, 1, 1);
        this._entryLng = new Gtk.Entry();
        this.attach(this._entryLng, 1, i++, 1, 1);
        
        this.attach(new Gtk.Label({ label: _('Elevasi'), halign : Gtk.Align.END}), 0, i, 1, 1);
        this._entryElev = new Gtk.Entry();
        this.attach(this._entryElev, 1, i++, 1, 1);
        
        let btn = new Gtk.Button({
            label: "OK", halign : Gtk.Align.END});
        //btn.connect('clicked', Lang.bind (this, function(){
			//this._settings.set_string('kota', this._entryKota.get_text());
			//this._settings.set_string('lat', this._entryLat.get_text());
			//this._settings.set_string('lng', this._entryLng.get_text());
			//this._settings.set_string('elevasi', this._entryElev.get_text());
        //}));
        this.attach(btn, 0, i, 1, 1);

	}
	
});

function buildPrefsWidget() {
    let w = new NetepanPrefsWidget();
    w.show_all();
    return w;
}
