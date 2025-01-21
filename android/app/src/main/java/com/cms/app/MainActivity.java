package com.cms.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.cms.app.VolumeControlPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(VolumeControlPlugin.class);
  }
}
