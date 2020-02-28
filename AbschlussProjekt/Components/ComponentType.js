export var ComponentType;
(function (ComponentType) {
    ComponentType[ComponentType["Behaviour"] = 0] = "Behaviour";
    ComponentType[ComponentType["BoxCollider"] = 1] = "BoxCollider";
    ComponentType[ComponentType["CapsuleCollider"] = 2] = "CapsuleCollider";
    ComponentType[ComponentType["CircleCollider"] = 3] = "CircleCollider";
    ComponentType[ComponentType["Collider"] = 4] = "Collider";
    ComponentType[ComponentType["Component"] = 5] = "Component";
    ComponentType[ComponentType["Transform"] = 6] = "Transform";
})(ComponentType || (ComponentType = {}));
