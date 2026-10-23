# errfold

실패한 도구 호출을 한 줄로 접는 모드입니다.

[English](README.md)

## 왜 필요한가

도구 호출이 실패하면 오류 전문이 대화 기록에 그대로 출력됩니다.

- 긴 스택 트레이스가 대화를 화면 밖으로 밀어냅니다.
- 재시도할 때마다 같은 오류가 반복됩니다.
- 스크롤로 지나간 오류는 다시 찾기 어렵습니다.

errfold는 호출이 끝나는 시점에 실패를 기록하고, 대화 기록의 해당 행을 한 줄로 접으며, 전체 목록은 명령 하나로 볼 수 있게 합니다.

## Install

터미널 세션의 프롬프트에서 다음 명령을 실행합니다.

```
/plugin install errfold --marketplace summerz/errfold
```

마켓플레이스 추가 여부에 `y`로 답하고 범위(scope)를 선택합니다.

- 프롬프트: 위 명령을 실행합니다.
- 셸: `claude plugin install errfold --marketplace summerz/errfold`
- 데스크톱 앱: `/plugin`이 동작하지 않습니다. 프롬프트 입력창 옆의 +를 누르고 Plugins, Add marketplace에 `summerz/errfold`을 입력한 뒤 Add plugin을 누릅니다.

## 기능

- 실패한 도구 호출을 완료 시점에 모두 기록합니다.
- 대화 기록에서 실패한 행을 한 줄로 접습니다.
- `/errors`로 오류 목록 창을 엽니다. 최근 오류가 위에 표시되며, `[clear]`(키 `c`)로 목록을 비웁니다.
- `status`가 켜져 있으면 상태 표시줄에 `✗ n tool errors`를 표시합니다.
- `lines`로 창에 표시할 오류별 줄 수를 정합니다.

## 설정

| 설정 | 기본값 | 동작 |
| --- | --- | --- |
| `lines` | `8` | `/errors` 창에 표시할 오류별 줄 수입니다 |
| `status` | `true` | 상태 표시줄에 `✗ n tool errors`를 표시합니다 |

설정 메뉴의 플러그인 항목에서 변경하거나 `~/.claude/settings.json`을 수정합니다.

```json
{ "pluginConfigs": { "errfold": { "lines": "12", "status": false } } }
```

## License

MIT
