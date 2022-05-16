import BadDataException from '../Exception/BadDataException';
import IP from './IP';

export default class IPv4 extends IP {
    public constructor(ip: string) {
        // TODO: Validate if this is actually ipv4 before calling super()
        super(ip);
    }

    public override isIPv4(): boolean {
        if (IPv4.isValidIpv4(this.ip)) {
            return true;
        }
        throw new BadDataException('This IP address is not valid IPv4');
    }

    public override isIPv6(): boolean {
        if (IPv4.isValidIpv6(this.ip)) {
            return true;
        }
        throw new BadDataException('This IP address is not valid IPv6');
    }
}
