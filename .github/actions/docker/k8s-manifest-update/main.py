import yaml


def obtain_search_path_by_kind(kind: str) -> str:
    if kind == 'Deployment':
        return 'spec.template.spec.containers'
    elif kind == 'StatefulSet':
        return 'spec.template.spec.containers'
    elif kind == 'DaemonSet':
        return 'spec.template.spec.containers'
    elif kind == 'CronJob':
        return 'spec.jobTemplate.spec.template.spec.containers'
    elif kind == 'Job':
        return 'spec.template.spec.containers'
    elif kind == 'Pod':
        return 'spec.containers'
    else:
        raise ValueError(f'Unsupported Kubernetes resource kind: {kind}')


def get_containers(deployment: dict, path: str):
    keys = path.split('.')
    current = deployment
    for key in keys:
        if key not in current:
            raise ValueError(f'Path {path} not found in the deployment')
        current = current[key]
    return current


def get_desired_container(containers: list[dict], container_name: str) -> dict:
    for container in containers:
        if container['name'] == container_name:
            return container
    raise ValueError(f'Container with name {container_name} not found in the deployment')


def parse_yaml_file_to_dict(file_path: str) -> dict:
    with open(file_path, 'r') as f:
        return yaml.safe_load(f)


def save_changes_to_yaml_file(data: dict, file_path: str) -> None:
    with open(file_path, 'w') as f:
        yaml.dump(data, f)


if __name__ == '__main__':
    yaml_file_dict: dict = parse_yaml_file_to_dict(file_path)
    kind = yaml_file_dict.get('kind')
    if not kind:
        raise ValueError('Kind not found in the YAML file')
    search_path = obtain_search_path_by_kind(kind)
    containers = get_containers(yaml_file_dict, search_path)
    desired_container = get_desired_container(containers, 'aura')
    print(desired_container)
    desired_container['image'] = 'ghcr.io/sisal-nppl/nppl-aura:latest'
    print(desired_container)
    print(yaml.dump(yaml_file_dict))
    save_changes_to_yaml_file(yaml_file_dict, file_path)
