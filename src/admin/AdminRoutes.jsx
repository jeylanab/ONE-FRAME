import { Routes, Route } from "react-router-dom";

import DesignTypesAdmin from "./collections/DesignTypesAdmin";
import ShapesAdmin from "./collections/ShapesAdmin";
import SetupAdmin from "./collections/SetupAdmin";
import CornersAdmin from "./collections/CornerAdmin";
import FramesAdmin from "./collections/FramesAdmin";
import FabricAdmin from "./collections/FabricAdmin";
import LightingAdmin from "./collections/LightingAdmin";
import ControlsAdmin from "./collections/ControlAdmin";
import AcousticsAdmin from "./collections/AcousticAdmin";
import PrebuildAdmin from "./collections/PreBuildAdmin";
import FreightAdmin from "./collections/FreightAdmin";
import UsersAdmin from "./collections/UserAdmin";
import WordAdmin from "./collections/WordAdmin";
import AdminQuotes from "./collections/AdminQuotes";



export default function AdminRoutes() {
  return (
    <Routes>
          <Route path="design-type" element={<DesignTypesAdmin />} />
          <Route path="shape" element={<ShapesAdmin />} />
          <Route path="setup" element={<SetupAdmin />} />
          <Route path="corners" element={<CornersAdmin />} />
          <Route path="frame" element={<FramesAdmin />} />
          <Route path="fabric" element={<FabricAdmin />} />
          <Route path="lighting" element={<LightingAdmin />} />
          <Route path="controls" element={<ControlsAdmin />} />
          <Route path="acoustics" element={<AcousticsAdmin />} />
          <Route path="prebuild" element={<PrebuildAdmin />} />
          <Route path="freight" element={<FreightAdmin />} />
      <Route path="user" element={<UsersAdmin />} />
      <Route path="word" element={<WordAdmin />} />
      <Route path="quotes" element={<AdminQuotes />} />
    </Routes>
  );
}
