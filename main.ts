import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class Hider extends Plugin {
  settings: HiderSettings;

  async onload() {
    // load settings
    await this.loadSettings();

    // add the settings tab
    this.addSettingTab(new HiderSettingTab(this.app, this));
    // add the toggle on/off command

    this.addCommand({
      id: 'toggle-tab-containers',
      name: 'Toggle tab bar',
      callback: () => {
        this.settings.hideTabs = !this.settings.hideTabs;
        this.saveData(this.settings);
        this.refresh();
      }
    });
    this.addCommand({
      id: 'toggle-app-ribbon',
      name: 'Toggle app ribbon',
      callback: () => {
        this.settings.hideRibbon = !this.settings.hideRibbon;
        this.saveData(this.settings);
        this.refresh();
      }
    });
    this.addCommand({
      id: 'toggle-hider-status',
      name: 'Toggle status bar',
      callback: () => {
        this.settings.hideStatus = !this.settings.hideStatus;
        this.saveData(this.settings);
        this.refresh();
      }
    });
    this.refresh()
  }

  onunload() {
    console.log('Unloading Hider plugin');
  }

  async loadSettings() {
    this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  // refresh function for when we change settings
  refresh = () => {
    // re-load the style
    this.updateStyle()
  }

  // update the styles (at the start, or as the result of a settings change)
  updateStyle = () => {
    document.body.classList.toggle('hider-ribbon', this.settings.hideRibbon);
    document.body.classList.toggle('hider-status', this.settings.hideStatus);
    document.body.classList.toggle('hider-tabs', this.settings.hideTabs);
    document.body.classList.toggle('hider-scroll', this.settings.hideScroll);
    document.body.classList.toggle('hider-tooltips', this.settings.hideTooltips);
    document.body.classList.toggle('hider-search-suggestions', this.settings.hideSearchSuggestions);
    document.body.classList.toggle('hider-search-counts', this.settings.hideSearchCounts);
    document.body.classList.toggle('hider-instructions', this.settings.hideInstructions);
    document.body.classList.toggle('hider-meta', this.settings.hideMeta);
    document.body.classList.toggle('hider-vault', this.settings.hideVault);

    // if "hide titlebar" is on, show titlebar on hover.
    if (this.settings.frameless) {
      document.addEventListener("mousemove", ShowTitleBarOnHover, true);
    } else {
      document.removeEventListener("mousemove", ShowTitleBarOnHover, true);
    }
  }

}

interface HiderSettings {
  hideRibbon: boolean;
  hideStatus: boolean;
  hideTabs: boolean;
  hideScroll: boolean;
  hideTooltips: boolean;
  hideSearchSuggestions: boolean;
  hideSearchCounts: boolean;
  hideInstructions: boolean;
  hideMeta: boolean;
  hideVault: boolean;
}
const DEFAULT_SETTINGS: HiderSettings = {
  hideRibbon: false,
  hideStatus: false,
  hideTabs: false,
  hideScroll: false,
  hideTooltips: false,
  hideSearchSuggestions: false,
  hideSearchCounts: false,
  hideInstructions: false,
  hideMeta: false,
  hideVault: false
}

const ShowTitleBarOnHover = function(event: MouseEvent) {
  if (event.clientY <= 40 && event.clientY - event.movementY > 40 && document.body.classList.contains('hider-frameless')) {
    document.body.classList.toggle('hider-frameless');
  }
  if (event.clientY > 40 && event.clientY - event.movementY <= 40 && !document.body.classList.contains('hider-frameless')) {
    document.body.classList.toggle('hider-frameless');
  }
}

class HiderSettingTab extends PluginSettingTab {


  plugin: Hider;
  constructor(app: App, plugin: Hider) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let {containerEl} = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Hide app ribbon')
      .setDesc('Hides the Obsidian menu. Warning: to open Settings you will need use the hotkey (default is CMD + ,)')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideRibbon)
          .onChange((value) => {
            this.plugin.settings.hideRibbon = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide tab bar')
      .setDesc('Hides the tab container at the top of the window')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideTabs)
          .onChange((value) => {
            this.plugin.settings.hideTabs = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide status bar')
      .setDesc('Hides word count, character count and backlink count')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideStatus)
          .onChange((value) => {
            this.plugin.settings.hideStatus = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide vault name')
      .setDesc('Hides the root folder name')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideVault)
          .onChange((value) => {
            this.plugin.settings.hideVault = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide scroll bars')
      .setDesc('Hides all scroll bars')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideScroll)
          .onChange((value) => {
            this.plugin.settings.hideScroll = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide tooltips')
      .setDesc('Hides all tooltips')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideTooltips)
          .onChange((value) => {
            this.plugin.settings.hideTooltips = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide instructions')
      .setDesc('Hides instructional tips in modals')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideInstructions)
          .onChange((value) => {
            this.plugin.settings.hideInstructions = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide search suggestions')
      .setDesc('Hides suggestions in search pane')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideSearchSuggestions)
          .onChange((value) => {
            this.plugin.settings.hideSearchSuggestions = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide count of search term matches')
      .setDesc('Hides the number of matches within each search result')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideSearchCounts)
          .onChange((value) => {
            this.plugin.settings.hideSearchCounts = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );

    new Setting(containerEl)
      .setName('Hide metadata block in Reading view')
      .setDesc('When front matter is turned off in your Editor settings this hides the metadata block')
      .addToggle(toggle => toggle.setValue(this.plugin.settings.hideMeta)
          .onChange((value) => {
            this.plugin.settings.hideMeta = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.refresh();
            })
          );



  }
}
