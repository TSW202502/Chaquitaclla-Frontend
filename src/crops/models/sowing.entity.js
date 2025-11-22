export class Sowing {
    constructor(id = '', start_date = '', harvest_date = '', area_land = 0, user_id = '', crop_id = '', crop_name = '', phenological_phase = '') {
        this.id = id;
        this.start_date = start_date;
        this.harvest_date = harvest_date;
        this.area_land = area_land;
        this.user_id = user_id;
        this.crop_id = crop_id;
        this.crop_name = crop_name;
        this.phenological_phase = phenological_phase;
    }

    static fromDisplayableSowing(displayableSowing) {
        return new Sowing(
            displayableSowing.id,
            displayableSowing.start_date,
            displayableSowing.harvest_date,
            displayableSowing.area_land,
            displayableSowing.user_id,
            displayableSowing.crop_id,
            displayableSowing.crop_name,
            displayableSowing.phenological_phase
        );
    }

    static toDisplayableSowing(sowing) {
        return {
            id: sowing.id,
            start_date: sowing.start_date,
            harvest_date: sowing.harvest_date,
            area_land: sowing.area_land,
            user_id: sowing.user_id,
            crop_id: sowing.crop_id,
            crop_name: sowing.crop_name,
            phenological_phase: sowing.phenological_phase
        };
    }
}