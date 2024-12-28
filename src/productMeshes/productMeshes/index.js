import { Mesh, Vector3 } from "three";
const speed = 0.3;
export class PorductMesh {
    DefaultScale = new Vector3();
    SelectScale = new Vector3()
    DefaultPosition =  new Vector3();
    SelectPosition = new Vector3();
    PreviewPosition = new Vector3();
    Object = new Mesh();
    Scene;
    indexInScene;

    initialize() {
        this.Object.scale.copy(this.DefaultScale);
        this.Object.position.copy(this.DefaultPosition);

        this.Scene.add(this.Object);
    }



    selectMode() {
        this.Object.scale.lerp(this.SelectScale , speed);
        this.Object.position.lerp(this.SelectPosition , speed);
    }


    resetToDefault() {
        this.Object.scale.lerp(this.DefaultScale , speed);
        this.Object.position.lerp(this.DefaultPosition , speed);
    }

    setToPreviewPosition() {
        this.Object.position.set(this.PreviewPosition);
    }

    deleteSelf() {
        const mesh = this.Object;
        this.Scene.children = this.Scene.children.filter((item) => item !== mesh)
    }


    copy() {
        const result = new PorductMesh();
        result.DefaultPosition.copy(this.DefaultPosition);
        result.SelectPosition.copy(this.SelectPosition);
        result.DefaultScale.copy(this.DefaultScale);
        result.SelectScale.copy(this.SelectScale);
        result.PreviewPosition.copy(this.PreviewPosition);
        result.Object.copy(this.Object , true)

        return result;
    }
}