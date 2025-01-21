package com.cms.app;

import android.content.Context;
import android.media.AudioManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PluginCall;

@CapacitorPlugin(name = "VolumeControl")
public class VolumeControlPlugin extends Plugin {

    @PluginMethod
    public void getVolume(PluginCall call) {
        AudioManager audioManager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
        int currentVolume = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
        int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        float volumePercent = ((float) currentVolume / maxVolume) * 100;
        
        call.resolve(new com.getcapacitor.JSObject().put("volume", volumePercent));
    }

    @PluginMethod
    public void setVolume(PluginCall call) {
        Integer volume = call.getInt("volume");
        if (volume == null || volume < 0 || volume > 100) {
            call.reject("Invalid volume level. Must be between 0 and 100.");
            return;
        }
        
        AudioManager audioManager = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
        int maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
        int newVolume = (int) ((volume / 100.0) * maxVolume);
        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, newVolume, 0);

        call.resolve();
    }
}
